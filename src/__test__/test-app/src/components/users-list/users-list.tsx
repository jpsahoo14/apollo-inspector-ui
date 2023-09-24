import * as React from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import {
  TabList,
  Tab,
  Spinner,
  Text,
  Button,
} from "@fluentui/react-components";
import { useStyles } from "./users-list.styles";
import {
  users,
  refreshUsers as refreshUsersQuery,
} from "../../data/operations";

export const UsersList = () => {
  const styles = useStyles();
  const client = useApolloClient();
  const { data, loading, error } = useQuery(users);

  const usersComp = React.useMemo(() => {
    console.log({ data });
    if (data?.users?.users) {
      return data?.users?.users.map((user) => {
        return (
          <Tab value={`${user.id}`} key={`${user.id}`}>{`${user.name}`}</Tab>
        );
      });
    }

    return null;
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
    return <Spinner />;
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
        <TabList defaultSelectedValue="tab2" vertical>
          {usersComp}
        </TabList>
      </div>
    </div>
  );
};
