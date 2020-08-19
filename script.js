"use strict;"

/**
 * Used to check what browser the user is using to access the site.
 */
function detectUnsupporterBrowser() {
    // Checking if a cursor isn't present on the current device.
    if (window.matchMedia("(hover: none)").matches && window.matchMedia("(pointer: coarse)").matches) {
        // Displaying a warning message.
        showWarningMessage("<strong>Warning!</strong> Your device doesn't seem to have a cursor, which is needed in order to drop a mod folder in the box below.")
    } else {
        // Grabbed from https://stackoverflow.com/a/9851769/5686799
        const isUsingOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0, isUsingIE = /*@cc_on!@*/false || !!document.documentMode

        // Is any unsupported browser being used?
        if (isUsingOpera || isUsingIE) {
            // Displaying a warning message.
            showWarningMessage(`<strong>Warning!</strong> ${isUsingOpera ? "Opera" : isUsingIE ? "Internet Explorer" : "Your browser"} is currently lacking support for the necessary API that is used to read file name. Please use another browser.`)
        }
    }
}

/**
 * Used to display an error message.
 * @param {*} text The error text to display inside the infobox.
 */
function showErrorMessage(text) {
    const divInfo = document.getElementById("information")

    // Adding an appropiate class to display a color.
    divInfo.classList.remove("alert-warning")
    divInfo.classList.add("alert-danger")

    // Calling a function to display the text inside the infobox.
    showMessage(text)
}

/**
 * Used to display a warning message.
 * @param {*} text The warning text to display inside the infobox.
 */
function showWarningMessage(text) {
    const divInfo = document.getElementById("information")

    // Adding an appropiate class to display a color.
    divInfo.classList.remove("alert-danger")
    divInfo.classList.add("alert-warning")

    // Calling a function to display the text inside the infobox.
    showMessage(text)
}

/**
 * Used to display a message.
 * @param {*} text The text to display inside the infobox.
 */
function showMessage(text) {
    const divInfo = document.getElementById("information")

    // Checking if there is any text to display.
    if (text !== undefined) {
        divInfo.innerHTML = text
        divInfo.style.display = "block"
    } else {
        // No text to display. Removing all color classes and hides the infobox.
        divInfo.innerHTML = ""
        divInfo.style.display = "none"
        divInfo.classList.remove("alert-danger")
        divInfo.classList.remove("alert-warning")
    }
}

/**
 * Used to catch all dropped files.
 * @param {*} evt The drop event containg all files/folders.
 */
function handleFileSelect(evt) {
    // Prevents the browser from handling the dropped files.
    evt.stopPropagation();
    evt.preventDefault();

    const items = event.dataTransfer.items, list = document.getElementById("output"), button = document.getElementById("buttonCopy"), filenames = new Array(), folders = new Array()

    // Clears the list of all content.
    list.innerHTML = ""

    // Iterates through all data items.
    for (let i = 0; i < items.length; i++) {
        // Making sure the data is not plain text.
        if (items[i].kind === "file") {
            let entry = null

            // Converts the iterated object into an entry in order to determine if it is a folder or a file.
            try {
                entry = items[i].getAsEntry()
            } catch (errorA) {
                try {
                    entry = items[i].webkitGetAsEntry()
                } catch (errorB) {
                    showErrorMessage("<strong>Error!</strong> Unable to parse the dropped files. Try using a different browser.")
                }
            }

            // Making sure a valid entry has been returned.
            if (entry !== null) {
                // Checking if the entry is a file.
                if (isJarFile(entry)) {
                    filenames.push(entry.name)
                } else {
                    // Checking if the entry is a folder.
                    if (entry.isDirectory) {
                        folders.push(parseDirectoryEntry(entry))
                    }
                }
            }
        }
    }

    // Iterates through all folders.
    Promise.all(folders).then(folderContent => {
        folderContent.forEach(folderContentEntry => {
            folderContentEntry.forEach(entry => {
                // Checking if the element is a file that ends with "jar".
                if (isJarFile(entry)) {
                    // Adds the filename to the list.
                    filenames.push(entry.name)
                }
            })
        })

        // Updates the content of the header above the list of found mods.
        updateHeaderCount(filenames.length)

        // Sorts all elements in alphabetic order.
        filenames.sort(function (a, b) { return a.localeCompare(b, "en", { "sensitivity": "base" }) })

        // Calculates the hue difference between each mod entry.
        const colors = fillArray(107.8, 185.5, filenames.length)

        // Iterates through alla filenames to 
        for (let index = 0; index < filenames.length; index++) {
            addEntryToList(filenames[index], `linear-gradient(to right, hsl(${colors[index][0]}, 93%, 70%), hsl(${colors[index][1]}, 93%, 70%)`)
        }

        // Enables the button if the number of found mods are more than 0.
        button.disabled = (filenames.length == 0)
    })
}

/**
 * Used to detemine if an element is a jar file.
 * @param {*} element The element to check.
 */
function isJarFile(element) {
    // Returns true if the given element is a file AND ends with "JAR".
    return element.isFile && element.name.endsWith(".jar")
}

/**
 * Used to fill an array with color values.
 * @param {*} from The start value.
 * @param {*} to The end value.
 * @param {*} numberOf The number of elements to generate.
 */
function fillArray(from, to, numberOf) {
    const arr = new Array(numberOf), diff = (to - from) / numberOf

    // Iterates the given amount of times.
    for (let index = 0; index < numberOf; index++) {
        arr[index] = [[roundUp(from + index * diff)], [roundUp(from + (index + 1) * diff)]]
    }

    // Returns the filled array.
    return arr
}

/**
 * Used to round up a number.
 * @param {*} number The number to be rounded.
 */
function roundUp(number) {
    return Math.round((number) * 100) / 100
}

/**
 * Used to update the header containing the number of found mods.
 * @param {*} count The number of mods.
 */
function updateHeaderCount(count = 0) {
    document.getElementById("countHeader").innerHTML = `Found ${count} JAR ${count == 1 ? "file" : "files"}`
}

/**
 * Used to add a mod to the list.
 * @param {*} filename The name of the mod file.
 * @param {*} background The background color of the mod.
 */
function addEntryToList(filename, background) {
    const divModName = document.createElement("div"),
        modList = document.getElementById("output")

    // Adding the file name.
    divModName.innerHTML = filename
    // Adding the class used to style the mod entries.
    divModName.setAttribute("class", "modEntry")
    // Sets the background color.
    divModName.style.backgroundImage = background

    // Adds the new entry to the list.
    modList.appendChild(divModName)
}

/**
 * Used to handle drag events.
 * @param {*} evt The drag event.
 */
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
}

/**
 * Used to handle hover event for 
 * @param {*} evt The drag event.
 */
function handleDragEnter(evt) {
    evt.target.classList.add("dropzoneFadeIn")
    evt.target.classList.remove("dropzoneFadeOut")
}

/**
 * Used to handle the drag event for 
 * @param {*} evt The drag event.
 */
function handleDragEnd(evt) {
    evt.target.classList.add("dropzoneFadeOut")
    evt.target.classList.remove("dropzoneFadeIn")
}

/**
 * Used to iterate through all files in a directory.
 * @param {*} directoryEntry The directory.
 */
function parseDirectoryEntry(directoryEntry) {
    const directoryReader = directoryEntry.createReader()

    // Iterates all files in the directory.
    return new Promise((resolve, reject) => {
        directoryReader.readEntries(
            entries => {
                resolve(entries)
            },
            err => {
                reject(err)
            }
        );
    });
}

/**
 * Used to copy all listed mods to the clipboard.
 */
function copyToClipboard() {
    const textarea = document.getElementById("copyArea"), label = document.getElementById("copyMessage"), modlist = document.getElementsByClassName("modEntry"), button = document.getElementById("buttonCopy"), mods = new Array()

    // Making sure there are any mods to copy.
    if (modlist.length > 0) {
        // Iterates all mod entries.
        for (let index = 0; index < modlist.length; index++) {
            // Adding a mod entry to the array.
            mods.push(modlist[index].textContent)
        }

        // Formatting the mod list into a bullet list.
        textarea.value = `* ${mods.join("\n* ")}`

        // Selecting all text in the textarea.
        textarea.select();
        textarea.setSelectionRange(0, 99999);

        // Copying the selected text to the clipboard.
        document.execCommand("copy");

        // Displaying a message to indicate that the list is in the clipboard.
        label.textContent = "📋 Copied!"
        // Adding an animation class to make the message fade in.
        label.classList.remove("messageFadeOut")
        label.classList.add("messageFadeIn")

        // Disabling the button.
        button.disabled = true
        // Adding an animation class to make the button fade to grey.
        button.classList.remove("buttonEnabled")
        button.classList.add("buttonDisabled")

        // Sets a timer for the message.
        setTimeout(function () {
            // Adding an animation class to make the message fade out.
            label.classList.remove("messageFadeIn")
            label.classList.add("messageFadeOut")
        }, 1500);

        // Sets a timer for the button.
        setTimeout(function () {
            // Enabling the button.
            button.disabled = false
            // Adding an animation class to make the button colorful.
            button.classList.remove("buttonDisabled")
            button.classList.add("buttonEnabled")
        }, 3500);
    }
}

// Initializing the drag and drop listeners.
const dropZone = document.getElementById("dropzone");
dropZone.addEventListener("dragenter", handleDragEnter, false);
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("dragleave", handleDragEnd, false);
dropZone.addEventListener("drop", handleFileSelect, false);
dropZone.addEventListener("drop", handleDragEnd, false);

updateHeaderCount()
detectUnsupporterBrowser()
