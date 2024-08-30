export const idlFactory = ({ IDL }) => {
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'icon' : IDL.Text,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'getProgress' : IDL.Func([], [IDL.Float64], ['query']),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'toggleTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
