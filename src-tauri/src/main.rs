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
        .plugin(tauri_plugin_store::Builder::default().build())
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
                        // Need to hide the preferences window here
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
                        //? Check if we have a preferences window already
                        let preferences_window = app.get_window("preferences_window");

                        if preferences_window.is_none() {
                            //? If we don't then we build a new onw
                            dbg!("building new window");
                            open_preferences_window(app.clone());
                        } else {
                            //? If we do then we just show it
                            dbg!("showing existing window");
                            // preferences_window.unwrap().show().unwrap();
                            preferences_window.unwrap().set_focus().unwrap();
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
                //TODO: this still acts a bit wonky when the preferences window it open
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

// Command to make creating prefs window easier in the future
fn open_preferences_window(app_handle: tauri::AppHandle) {
    let window = tauri::WindowBuilder::new(
        &app_handle,
        "preferences_window",
        tauri::WindowUrl::App("index.html".into()),
    )
    .build()
    .unwrap();

    window.set_title("").unwrap();
}

// fn open_picker_window(app_handle: tauri::AppHandle) {
//     let enigo = Enigo::new();
//     let (cursor_x, cursor_y): (i32, i32) = Enigo::mouse_location(&enigo);
//     dbg!(cursor_x);
//     dbg!(cursor_y);
//     let window = tauri::WindowBuilder::new(
//         &app_handle,
//         "picker_window",
//         tauri::WindowUrl::App("index.html".into()),
//     )
//     .build()
//     .unwrap();

//     // let window_position = Pos {
//     //     x: cursor_x,
//     //     y: cursor_y,
//     // }

//     window.set_position(window);
//     window.set_title("").unwrap();
// }
