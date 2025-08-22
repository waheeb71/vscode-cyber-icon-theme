'use strict';

import { type ExtensionContext, env, workspace } from 'vscode';
import { initTranslations, logger } from '../../core';
import { disableLogObserver, observeLogs } from '../logging/logger';
import { detectConfigChanges } from '../tools/changeDetection';
import { registered } from '../tools/registered';
import * as vscode from 'vscode';
import { changeFolderColor } from '../commands/folderColor';
/**
 * This method is called when the extension is activated.
 * It initializes the core functionality of the extension.
 */
export const activate = async (context: ExtensionContext) => {
  try {
    context.subscriptions.push(
    vscode.commands.registerCommand(
      'cyber-icon-theme.changeFolderColor',
      changeFolderColor
    )
  );
    observeLogs();

    await initTranslations(env.language);

    // Subscribe to the extension commands
    context.subscriptions.push(...registered);

    // Initially trigger the config change detection
    await detectConfigChanges(undefined, context);

    // Observe changes in the config
    context.subscriptions.push(
      workspace.onDidChangeConfiguration(
        async (event) => await detectConfigChanges(event, context)
      )
    );


    logger.info('Extension activated!');
  } catch (error) {
    logger.error(error);
  }
};

/** This method is called when the extension is deactivated */
export const deactivate = () => {
  disableLogObserver();
};
