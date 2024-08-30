import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Text "mo:base/Text";

actor {
  // Types
  type Task = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  // Stable variables
  stable var taskIdCounter: Nat = 0;
  stable var tasks: [var ?Task] = [var];

  // Helper functions
  func findTask(id: Nat): ?Task {
    if (id >= tasks.size()) {
      return null;
    };
    return tasks[id];
  };

  // Public functions
  public func addTask(text: Text) : async Nat {
    let id = taskIdCounter;
    let newTask: Task = {
      id = id;
      text = text;
      completed = false;
    };

    if (id >= tasks.size()) {
      // Extend the array if necessary
      let newTasks = Array.tabulate<(?Task)>(id + 1, func (i: Nat): ?Task {
        if (i < tasks.size()) { tasks[i] } else { null }
      });
      tasks := Array.thaw(newTasks);
    };

    tasks[id] := ?newTask;
    taskIdCounter += 1;
    id
  };

  public func toggleTask(id: Nat) : async Bool {
    switch (findTask(id)) {
      case (null) {
        return false;
      };
      case (?task) {
        let updatedTask: Task = {
          id = task.id;
          text = task.text;
          completed = not task.completed;
        };
        tasks[id] := ?updatedTask;
        return true;
      };
    };
  };

  public query func getTasks() : async [Task] {
    Array.mapFilter<(?Task), Task>(Array.freeze(tasks), func (t: ?Task): ?Task { t });
  };

  public query func getProgress() : async Float {
    let totalTasks = Array.size(Array.filter<(?Task)>(Array.freeze(tasks), func (t: ?Task): Bool { Option.isSome(t) }));
    if (totalTasks == 0) {
      return 0;
    };
    let completedTasks = Array.size(Array.filter<(?Task)>(Array.freeze(tasks), func (t: ?Task): Bool {
      switch(t) {
        case (null) { false };
        case (?task) { task.completed };
      }
    }));
    Float.fromInt(completedTasks) / Float.fromInt(totalTasks);
  };
}
