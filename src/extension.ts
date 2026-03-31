import * as vscode from "vscode";

let showPanelTimeout: ReturnType<typeof setTimeout> | undefined;

function isEnabled(): boolean {
  return vscode.workspace
    .getConfiguration("panelAutoHide")
    .get<boolean>("enabled", true);
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor || !isEnabled()) {
        return;
      }

      // An editor is active — cancel any pending show-panel
      if (showPanelTimeout) {
        clearTimeout(showPanelTimeout);
        showPanelTimeout = undefined;
      }

      vscode.commands.executeCommand("workbench.action.closePanel").then(undefined, () => {});
    }),

    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      if (editors.length > 0 || !isEnabled()) {
        if (showPanelTimeout) {
          clearTimeout(showPanelTimeout);
          showPanelTimeout = undefined;
        }
        return;
      }

      // Debounce: tab switches briefly report 0 editors.
      // Wait to confirm no editors are truly visible before showing.
      showPanelTimeout = setTimeout(() => {
        showPanelTimeout = undefined;
        if (vscode.window.visibleTextEditors.length === 0) {
          vscode.commands.executeCommand("workbench.action.togglePanel").then(undefined, () => {});
        }
      }, 150);
    }),
  );
}

export function deactivate() {
  if (showPanelTimeout) {
    clearTimeout(showPanelTimeout);
  }
}
