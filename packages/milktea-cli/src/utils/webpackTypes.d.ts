/* webpack未导出的类型 */
import { Compiler, Stats } from 'webpack';

export interface CallbackFunction<T> {
  (err?: Error, result?: T): any;
}

type LibraryExport = string | string[];

export declare class Watching {
  startTime: number;
  invalid: boolean;
  handler: CallbackFunction<Stats>;
  callbacks: CallbackFunction<void>[];
  closed: boolean;
  suspended: boolean;
  watchOptions: {
    aggregateTimeout?: number;
    ignored?: LibraryExport;
    poll?: number | boolean;
    stdin?: boolean;
  };
  compiler: Compiler;
  running: boolean;
  watcher: any;
  pausedWatcher: any;
  watch(files: Iterable<string>, dirs: Iterable<string>, missing: Iterable<string>): void;
  invalidate(callback?: CallbackFunction<void>): void;
  suspend(): void;
  resume(): void;
  close(callback: CallbackFunction<void>): void;
}