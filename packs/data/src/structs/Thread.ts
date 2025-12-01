import { system } from "@minecraft/server";
import { getNumberLiteral } from "../cosmic/src/Primitives/Number.ts";
import { NativeFunction } from "../cosmic/src/Struct/NativeFunction.ts";
import { NativeFunctionHelper } from "../cosmic/src/Struct/NativeFunctionHelper.ts";
import { StructType } from "../cosmic/src/Struct/StructType.ts";

export const delayInTicks = (ticks: number): Promise<void> => {
  return new Promise((resolve) => {
    const id = system.runTimeout(() => {
      system.clearRun(id);
      resolve();
    }, ticks);
  });
};

export const Thread = new StructType("Thread", [], [
  new NativeFunction("Sleep", async (interpreter, ctx, start, end, args) => {
    const helper = new NativeFunctionHelper(interpreter, args, 1, start, end);
    const ticks = getNumberLiteral(helper.expectType(0, "Number"));

    await delayInTicks(ticks);
    return [null, ctx];
  }),
]);
