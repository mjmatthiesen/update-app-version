// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('upappver.manifest', updateManifest));
	context.subscriptions.push(vscode.commands.registerCommand('upappver.manifestAndBuild', updateManifestAndBuild));
	//vscode.commands.registerCommand('upappver.package', updateManifest);
	// vscode.commands.registerCommand('al.package', updateManifest);
	// vscode.commands.registerCommand('al.publishNoDebug', updateManifest);
	// vscode.commands.registerCommand('al.publish', updateManifest);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function updateManifest() {
	// workspace must be defined
	if (vscode.workspace.workspaceFolders) {
		// app.json should live in root
		const manifestUri = vscode.workspace.workspaceFolders[0].uri.fsPath + '\\app.json';
		vscode.window.showInformationMessage(manifestUri);
		// get manifest json
		let manifest = JSON.parse(fs.readFileSync(manifestUri).toString());
		// get most minor version
		let split = manifest['version'].split('.');
		// only if it exists
		if (split[3]) {
			// get current date time localized to mst in YYMMDDHHMM
			split[3] = new Date().toLocaleString('en-CA', { timeZone: 'America/Edmonton', hour12: false, year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}).replace(/\D+/g, '');
			// update version and save
			manifest['version'] = split.join('.');
			// 2 = beautify of json file
			fs.writeFileSync(manifestUri, JSON.stringify(manifest, null, 2));
		}
	}
}

function updateManifestAndBuild() {
	updateManifest();
	vscode.commands.executeCommand('al.package');
}