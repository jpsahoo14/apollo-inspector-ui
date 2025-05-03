import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchProps {
  onSearchChange: (e: React.SyntheticEvent) => void;
}

export const Search = React.memo(({ onSearchChange }: SearchProps) => {
  return (
    <Input
      prefix={<SearchOutlined />}
      placeholder="OpName1, OpName2"
      onChange={(e: React.SyntheticEvent) => onSearchChange(e)}
    />
  );
});

Search.displayName = "Search";
