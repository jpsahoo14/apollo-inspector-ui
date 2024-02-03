I've attached the non-minified source code. Also here is the link to the github repository:https://github.com/jpsahoo14/apollo-inspector-ui

To test this extension, do the following steps

1. Clone the repo to your machine
2. Using any terminal switch to apollo-inspector-ui folder
3. Go to file `extension/browsers/firefox/manifest.json`. Copy the contents of this file and replace the contents of `extension/manifest.json`
4. run `yarn` and wait for it to finish
5. run `yarn parcel:test:nocache:start` in one terminal
6. run `yarn build:extension:dev` in another terminal
7. It'll build the extension in apollo-inspector-ui/build/extension folder
8. Upload the extension to firefox for testing.
