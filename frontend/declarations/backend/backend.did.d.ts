import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Task { 'id' : bigint, 'text' : string, 'completed' : boolean }
export interface _SERVICE {
  'addTask' : ActorMethod<[string], bigint>,
  'getProgress' : ActorMethod<[], number>,
  'getTasks' : ActorMethod<[], Array<Task>>,
  'toggleTask' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
