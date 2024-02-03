import React from "react";
import { Search20Regular } from "@fluentui/react-icons";
import { Input, useId } from "@fluentui/react-components";

interface SearchProps {
  onSearchChange: (e: React.SyntheticEvent) => void;
}

export const Search = React.memo(({ onSearchChange }: SearchProps) => {
  const inputId = useId("input");
  return (
    <Input
      contentBefore={<Search20Regular />}
      placeholder="OpName1, OpName2"
      onChange={(e: React.SyntheticEvent) => onSearchChange(e)}
      appearance="outline"
      id={inputId}
    />
  );
});

Search.displayName = "Search";
