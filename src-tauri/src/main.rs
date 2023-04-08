use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_positioner::{Position, WindowExt};

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");
    let preferences =
        CustomMenuItem::new("preferences".to_string(), "Preferences").accelerator("Cmd+P");
    let system_tray_menu = SystemTrayMenu::new().add_item(quit).add_item(preferences);

    tauri::Builder::default()
        .setup(|app| {
            // Build the preferences window here
            tauri::WindowBuilder::new(
                app,
                "preferences_window",
                tauri::WindowUrl::App("index.html".into()),
            )
            // Not visible by default
            .visible(false)
            .build()?;
            Ok(())
        })
        .plugin(tauri_plugin_positioner::init())
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                SystemTrayEvent::LeftClick {
                    position: _,
                    size: _,
                    ..
                } => {
                    let window = app.get_window("menu_bar").unwrap();
                    // use TrayCenter as initial window position
                    let _ = window.move_window(Position::TrayCenter);
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        // Need to hide the prefs window here
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "preferences" => {
                        // Check if the menu window is open, if so we want to hide it
                        let main_window = app.get_window("menu_bar").unwrap();
                        if main_window.is_visible().unwrap() {
                            main_window.hide().unwrap();
                        }
                        // Check if the preference window already exists, if so just focus on it
                        let prefs_window = app.get_window("preferences_window").unwrap();
                        prefs_window.show().unwrap();
                    }
                    _ => {}
                },
                _ => {}
            }
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Focused(is_focused) => {
                if !is_focused {
                    event.window().hide().unwrap();
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
