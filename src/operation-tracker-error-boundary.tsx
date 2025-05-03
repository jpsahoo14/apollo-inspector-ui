import React from "react";
import { Button, Typography } from "antd";

export interface IErrorBoundaryState {
  error?: IError;
}
export interface IError {
  error?: boolean;
  message?: string;
}
export class ErrorBoundary extends React.PureComponent<
  React.PropsWithChildren<unknown>,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {};

  public componentDidCatch(): void {
    this.setState({ error: { error: true, message: "Something went wrong" } });
  }

  public render(): JSX.Element {
    const { children } = this.props;

    if (this.state.error?.error) {
      return (
        <div>
          <Typography.Title level={2}>{this.state.error.message}</Typography.Title>
          <Button onClick={this.resetError}>Retry</Button>
        </div>
      );
    }

    return children as JSX.Element;
  }

  private resetError = () => {
    this.setState({
      error: undefined,
    });
  }
}
