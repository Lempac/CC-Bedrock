import { getNumberLiteral } from "../cosmic/src/Primitives/Number.ts";
import { NativeFunction } from "../cosmic/src/Struct/NativeFunction.ts";
import { NativeFunctionHelper } from "../cosmic/src/Struct/NativeFunctionHelper.ts";
import { StructType } from "../cosmic/src/Struct/StructType.ts";

export const MathStruct = new StructType("Math", [], [
  new NativeFunction("Sin", async (interpreter, ctx, start, end, args) => {
    const helper = new NativeFunctionHelper(interpreter, args, 1, start, end);
    const value = Math.sin(getNumberLiteral(helper.expectType(0, "Number")));
    return interpreter.number({ value }, ctx);
  }),

  new NativeFunction("Cos", async (interpreter, ctx, start, end, args) => {
    const helper = new NativeFunctionHelper(interpreter, args, 1, start, end);
    const value = Math.cos(getNumberLiteral(helper.expectType(0, "Number")));
    return interpreter.number({ value }, ctx);
  }),

  new NativeFunction("Tan", async (interpreter, ctx, start, end, args) => {
    const helper = new NativeFunctionHelper(interpreter, args, 1, start, end);
    const value = Math.tan(getNumberLiteral(helper.expectType(0, "Number")));
    return interpreter.number({ value }, ctx);
  }),

  new NativeFunction("Floor", async (interpreter, ctx, start, end, args) => {
    const helper = new NativeFunctionHelper(interpreter, args, 1, start, end);
    const value = Math.floor(getNumberLiteral(helper.expectType(0, "Number")));
    return interpreter.number({ value }, ctx);
  }),
]);
