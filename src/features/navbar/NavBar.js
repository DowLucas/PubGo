import React from "react";
import { Paper, Container, Grid, createStyles, Col } from "@mantine/core";
import {
  IconCirclePlus,
  IconHome,
  IconMessageCirclePlus,
  IconSettings2,
  IconUserStar,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { selectActiveTab, setActiveTab } from "./navbarSlice";
import { useDispatch, useSelector } from "react-redux";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.gray[0],
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    cursor: "pointer",
  },
  active: {
    backgroundColor: theme.colors.blue[6],
  },
}));

const Navbar = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const activePage = useSelector(selectActiveTab);

  const dispatch = useDispatch();

  // Check if user is logged in
  const user = useSelector((state) => state.auth.user);

  const handlePageChange = (page, name) => {
    dispatch(setActiveTab(name));
    navigate(page);
  };

  // Inital page load
  React.useEffect(() => {}, []);

  const spacing = 4;

  const navItemClass = (page) =>
    `${classes.navItem} ${activePage === page ? classes.active : ""}`;

  return (
    <Paper className={classes.navbar} shadow="xs">
      <Container>
        <Grid gutter="md" align="center">
          <Col span={spacing}>
            <div
              className={navItemClass("Events")}
              onClick={() => handlePageChange("/", "Events")}
            >
              <IconHome />
            </div>
          </Col>
          <Col span={spacing}>
            <div
              className={navItemClass("Create Event")}
              onClick={() => handlePageChange("/events/create", "Create Event")}
            >
              <IconCirclePlus />
            </div>
          </Col>
          <Col span={spacing}>
            <div
              className={navItemClass("Profile")}
              onClick={() => handlePageChange("/profile", "Profile")}
            >
              <IconUserStar />
            </div>
          </Col>
        </Grid>
      </Container>
    </Paper>
  );
};

export default Navbar;
