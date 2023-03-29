const saveOptions = () => {
    chrome.storage.sync.set(
        { userName: document.getElementById("userName").value },
        () => {
            alert("Settings saved successfully.")
        }
    )
}

const restoreOptions = () => {
    chrome.storage.sync.get(
        { userName: "" },
        (items) => {
            document.getElementById("userName").value = items.userName
        }
    )
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.getElementById("save").addEventListener("click", saveOptions)