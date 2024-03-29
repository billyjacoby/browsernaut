mod apps;

use apps::get_apps;
use enigo::{Enigo, MouseControllable};
use serde_json::json;
use std::{env, path::PathBuf};
use swift_rs::{swift, Bool, Int, SRString};
use tauri::{
    ActivationPolicy, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, Wry,
};
use tauri_plugin_store::{with_store, StoreCollection};

swift!(fn get_default_browser() -> SRString);
swift!(fn set_default_browser() -> Bool);
swift!(fn get_app_icon(file: &SRString, size: Int) -> SRString);

const APP_NAME: &str = "Browsernaut.app";
const STORE_PATH: &str = ".settings.dat";

fn main() {
    tauri_plugin_deep_link::prepare("de.fabianlars.deep-link-test");

    let picker = CustomMenuItem::new("picker".to_string(), "Open last URL").accelerator("Cmd+O");
    let preferences =
        CustomMenuItem::new("preferences".to_string(), "Preferences").accelerator("Cmd+P");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");
    let system_tray_menu = SystemTrayMenu::new()
        .add_item(picker)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(preferences)
        .add_item(quit);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            is_default_browser,
            make_default_browser,
            retrieve_app_icon,
            open_picker_window,
            open_preferences_window,
            get_apps
        ])
        .setup(|app| {
            //? Allows application to receive and parse the URI passed in when opened.
            let handle = app.handle();

            tauri_plugin_deep_link::register("", move |request| {
                dbg!(&request);

                //? Stores URL in app state to be accessed by FE
                let stores = handle.state::<StoreCollection<Wry>>();
                with_store(handle.clone(), stores, PathBuf::from(STORE_PATH), |store| {
                    store.insert("URL".to_string(), json!(request.to_string()))
                })
                .unwrap();

                open_picker_window(handle.clone());
                handle.emit_all("scheme-request-received", request).unwrap();
            })
            .unwrap();

            app.set_activation_policy(ActivationPolicy::Accessory);
            Ok(())
        })
        //? Allows for application positioning - for menu bar only
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .system_tray(
            SystemTray::new()
                .with_menu(system_tray_menu)
                .with_menu_on_left_click(true),
        )
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "preferences" => open_preferences_window(app.app_handle()),
                    "picker" => open_picker_window(app.app_handle()),
                    _ => {}
                },
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn retrieve_app_icon(file: &str, size: Option<Int>) -> String {
    let input: SRString = file.into();
    let result = unsafe { get_app_icon(&input, size.unwrap_or(256)) };
    return result.to_string();
}

#[tauri::command]
fn is_default_browser() -> bool {
    let default_browser_name = unsafe { get_default_browser() };
    dbg!(APP_NAME);
    dbg!(default_browser_name.to_string());
    return default_browser_name.to_string().eq(APP_NAME);
}

#[tauri::command]
fn make_default_browser() -> bool {
    return unsafe { set_default_browser() };
}

#[tauri::command]
fn open_preferences_window(app_handle: tauri::AppHandle) {
    let preferences_window = app_handle.get_window("preferences_window");
    if preferences_window.is_none() {
        tauri::WindowBuilder::new(
            &app_handle,
            "preferences_window",
            tauri::WindowUrl::App("index.html".into()),
        )
        .visible(false)
        .accept_first_mouse(true)
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .title("")
        .build()
        .unwrap();
    } else {
        preferences_window.unwrap().set_focus().unwrap();
    }
}

#[tauri::command]
fn open_picker_window(app_handle: tauri::AppHandle) {
    let enigo = Enigo::new();
    let window_width: f64 = 250.0;
    let window_height: f64 = 300.0;
    let (cursor_x, cursor_y): (i32, i32) = Enigo::mouse_location(&enigo);
    let picker_window = app_handle.get_window("picker_window");
    if picker_window.is_none() {
        let _ = tauri::WindowBuilder::new(
            &app_handle,
            "picker_window",
            tauri::WindowUrl::App("index.html".into()),
        )
        .resizable(true)
        .maximizable(false)
        .minimizable(false)
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .visible(false)
        .accept_first_mouse(true)
        .always_on_top(true)
        .inner_size(window_width as f64, window_height as f64)
        .title("")
        .position(
            cursor_x as f64 - (window_width / 2.0) as f64,
            cursor_y as f64 - 48 as f64,
        )
        .build()
        .unwrap();
    } else {
        dbg!("Picker window already exists");
        picker_window.unwrap().show().unwrap();
    }
}
