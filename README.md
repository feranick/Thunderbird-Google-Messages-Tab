# Google Messages Tab
Unofficial Google Messages add-on for Thunderbird, it adds a button that opens a Google Messages tab in Thunderbird.
The [home page](https://addons.mozilla.org/thunderbird/addon/thundergmessages/) of the extension contains some pictures and reviews.

#### Installing 
A new Google Messages icon should appear in the top-right corner of Thunderbird. Click to open.

#### Installing from sources
Download the repository, zip it, rename it to Google-Messages-Tab.xpi and choose install addon from file in Thunderbird.

In linux the xpi file can be created with the following commands
* `git clone https://github.com/feranick/Thunderbird-Google-Messages-Tab`
* `cd ./Thunderbird-Google-Messages-Tab`
* `VERSION=$(cat ./manifest.json | jq --raw-output '.version')`
* `zip -r "../Google-Messages-Tab-${VERSION}-tb.xpi" *`
