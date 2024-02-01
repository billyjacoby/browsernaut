use rust_search::SearchBuilder;

#[tauri::command]
pub fn get_apps() -> Vec<String> {
    let result: Vec<String>;
    result = search(
        vec!["~/Applications", "/Applications", "/System/Applications"],
        Some(".app"),
        Some(1),
    );
    return result;
}

fn search(
    search_locations: Vec<&str>,
    extension: Option<&str>,
    depth: Option<usize>,
) -> Vec<String> {
    let (location, more_locations) = search_locations.split_first().unwrap();
    let result: Vec<String> = SearchBuilder::default()
        .location(location)
        .more_locations(more_locations.to_vec())
        .depth(depth.unwrap_or(1))
        .ext(extension.unwrap_or("*"))
        .build()
        .collect();
    return result;
}
