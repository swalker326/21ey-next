import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Goal {
  readonly id: string;
  readonly type: string;
  readonly owner?: string;
  readonly name: string;
  readonly description?: string;
  readonly startDate?: string;
  readonly createdAt: string;
  readonly daysCompleted?: (string | null)[];
  constructor(init: ModelInit<Goal>);
  static copyOf(source: Goal, mutator: (draft: MutableModel<Goal>) => MutableModel<Goal> | void): Goal;
}