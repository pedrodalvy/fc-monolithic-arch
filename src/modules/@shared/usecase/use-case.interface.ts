export default interface UseCaseInterface<Input = unknown, Output = unknown> {
  execute(input?: Input): Promise<Output>;
}
