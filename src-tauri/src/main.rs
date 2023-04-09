use tauri::{
    ActivationPolicy, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
};
use tauri_plugin_positioner::{Position, WindowExt};

fn main() {
    tauri_plugin_deep_link::prepare("de.fabianlars.deep-link-test");

    let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");
    let preferences =
        CustomMenuItem::new("preferences".to_string(), "Preferences").accelerator("Cmd+P");
    let system_tray_menu = SystemTrayMenu::new().add_item(quit).add_item(preferences);

    tauri::Builder::default()
        .setup(|app| {
            //? Allows application to receive and parse the URI passed in when opened.
            let handle = app.handle();
            tauri_plugin_deep_link::register("https", move |request| {
                dbg!(&request);
                handle.emit_all("scheme-request-received", request).unwrap();
            })
            .unwrap();
            app.set_activation_policy(ActivationPolicy::Accessory);
            Ok(())
        })
        //? Allows for application positioning - for menu bar now and near cursor in the future
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
                        let menu_window = app.get_window("menu_bar").unwrap();
                        if menu_window.is_visible().unwrap() {
                            menu_window.hide().unwrap();
                        }
                        //? Check if we have a prefs window already
                        let prefs_window = app.get_window("preferences_window");
                        if prefs_window.is_none() {
                            //? If we don't then we build a new onw
                            let _ = tauri::WindowBuilder::new(
                                app,
                                "preferences_window", /* the unique window label */
                                tauri::WindowUrl::App("index.html".into()),
                            )
                            .build()
                            .unwrap();
                        } else {
                            //? If we do then we just show it
                            prefs_window.unwrap().show().unwrap();
                        }
                    }
                    _ => {}
                },
                _ => {}
            }
        })
        .on_window_event(|event| match event.event() {
            //? When clicking outside the menu bar window, we want to hide the menu bar window
            //? but not other windows
            tauri::WindowEvent::Focused(is_focused) => {
                //TODO: this still acts a bit wonky when the prefs window it open
                if !is_focused {
                    event
                        .window()
                        .get_window("menu_bar")
                        .unwrap()
                        .hide()
                        .unwrap();
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
