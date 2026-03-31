# Task: Improve the vscode-panel-auto-hide Extension

## What This Extension Does

A VS Code extension that gives you only **two states** — never both visible at the same time:

1. **Terminal full screen** (no files open)
2. **File full screen** (terminal hidden)

It is designed to work with this VS Code setting:

```json
"workbench.panel.opensMaximized": "always"
```

## What Needs to Change

When the user closes the last editor tab, the panel does **not** come back automatically. They're left with an empty editor area and no terminal. Add logic so the panel reopens when no editors are visible.

## Expected Behavior

| Action | Result |
|---|---|
| VS Code opens with no files | Terminal panel is full screen |
| User opens a file (double-click, Explorer, etc.) | Panel hides automatically, file is full screen |
| User opens another file | Panel stays hidden, new file is full screen |
| User closes a file (but others remain open) | Panel stays hidden, another file takes focus |
| User closes the **last** file | Panel comes back automatically, full screen |

## Implementation Guide

### Hide panel when an editor is active

- Listen for `vscode.window.onDidChangeActiveTextEditor`
- When an editor is present, call `workbench.action.closePanel`
- Do **not** use `toggleMaximizedPanel` — it opens the panel if already closed

### Show panel when no editors are visible

- Listen for `vscode.window.onDidChangeVisibleTextEditors`
- When the array is empty, call `workbench.action.togglePanel` to reopen the panel
- The `"workbench.panel.opensMaximized": "always"` setting handles making it full screen

### Critical: Debounce the show logic

During tab switches, VS Code briefly reports 0 visible editors before the new editor appears. Without debouncing, this causes the panel to flash open and immediately close.

- Wait ~150ms before showing the panel
- If an editor appears during that window, cancel the show
- After the delay, re-check `vscode.window.visibleTextEditors.length` before acting
