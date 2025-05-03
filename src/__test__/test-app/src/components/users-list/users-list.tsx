import * as React from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import { Tabs, Spin, Typography, Button } from "antd";
import { useStyles } from "./users-list.styles";
import {
  users,
  refreshUsers as refreshUsersQuery,
} from "../../data/operations";

const { Text } = Typography;

export const UsersList = () => {
  const styles = useStyles();
  const client = useApolloClient();
  const { data, loading, error } = useQuery(users);

  const tabItems = React.useMemo(() => {
    if (data?.users?.users) {
      return data.users.users.map(user => ({
        key: `${user.id}`,
        label: `${user.name}`
      }));
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    return () => console.log(`unmounted`);
  }, []);

  const refreshUsers = React.useCallback(async () => {
    await client.query({
      query: refreshUsersQuery,
      fetchPolicy: "network-only",
    });
  }, [client]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return (
      <>
        <Text>{"Error"}</Text>
      </>
    );
  }

  return (
    <div>
      <Button onClick={refreshUsers}>Refresh Users</Button>
      <div className={styles.root}>
        <Tabs 
          defaultActiveKey={tabItems.length > 0 ? tabItems[0].key : ""} 
          tabPosition="left"
          items={tabItems}
        />
      </div>
    </div>
  );
};
