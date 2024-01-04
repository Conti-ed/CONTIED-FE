import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { CiHome, CiGrid41, CiSquarePlus, CiSettings } from 'react-icons/ci';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 100%;
  height: 60px;
  background: ${(props) => props.theme.tabBgColor};
`;

const Tab = styled.div<{ $isActive: Boolean }>`
  font-size: 24px;
  color: ${(props) => (props.$isActive ? 'white' : 'gray')};
  cursor: pointer;
`;

function TabBar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const toggleDrawer =
    (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setOpen(inOpen);
    };

  return (
    <Container>
      <Link to={'/'}>
        <Tab $isActive={pathname === '/'}>
          <CiHome />
        </Tab>
      </Link>
      {pathname !== '/feed' ? (
        <Link to={'/feed'}>
          <Tab $isActive={pathname === '/feed'}>
            <CiGrid41 />
          </Tab>
        </Link>
      ) : (
        <Link to={'/feed'}>
          <Tab $isActive={pathname === '/feed'}>
            <Box sx={{ display: 'flex' }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={toggleDrawer(true)}
              >
                <CloudUploadIcon />
              </Button>
              <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
                <Box
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map(
                      (text) => (
                        <ListItem key={text}>
                          <ListItemButton>{text}</ListItemButton>
                        </ListItem>
                      )
                    )}
                  </List>
                  <Divider />
                  <List>
                    {['All mail', 'Trash', 'Spam'].map((text) => (
                      <ListItem key={text}>
                        <ListItemButton>{text}</ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </Box>
          </Tab>
        </Link>
      )}
      <Link to={'/settings'}>
        <Tab $isActive={pathname === '/settings'}>
          <CiSettings />
        </Tab>
      </Link>
    </Container>
  );
}

export default TabBar;
