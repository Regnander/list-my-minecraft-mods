# List my Minecraft Mods ⛏

## What is this?

This is a little project of mine that allows you to print a list of your Minecraft mods to the clipboard. It came to mind after seeing people posting screenshots of their mod folder when reporting errors for various Minecraft mods instead of listing them in a bullet list.

## How does it work?

In a nutshell, all files you drop inside the drop area that ends with `.jar` will be listed. Once you click the <kbd>📋</kbd> button, all listed mods are printed as a bullet list to your clipboard so you can paste it in a bug report. Nothing is uploaded since it isn't really necessary if we just want to read the file names.

## FAQ

### I want to see the mod author and version!

The version can usually be found inside the file name and I think listing the author isn't relevant, but if you want to know the author that badly you can always do a quick Google search on the mod name.

Besides, in order to do this I'd need to read the file contents, which means the files needs to be uploaded and I'm trying to avoid doing that.

### Why is my browser not supported?

I'm using `webkitGetAsEntry()` to read filenames which is currently supported the majority (but not all) browsers. A list of supported browsers can be found here: https://caniuse.com/mdn-api_datatransferitem_webkitgetasentry

### Why can't I use my phone / tablet / touchscreen device?

This is intended to be used on a desktop environment with modded *Minecraft: Java Edition* installed. Besides, the idea of people having *Java Edition* mods on their phone seems very unlikely to me.