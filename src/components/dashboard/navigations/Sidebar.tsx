"use client";
import {
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBloggerB } from "react-icons/fa";

const Sidebar = () => {
  const [openSliders, setOpenSliders] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openBlogs, setOpenBlogs] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Responsive behavior ke liye useEffect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true); // Mobile pe collapsed by default
      } else {
        setCollapsed(false); // Desktop pe expanded by default
      }
    };
    handleResize(); // Initial state set karne ke liye
    window.addEventListener("resize", handleResize); // Resize event listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const handleSlidersClick = () => {
    setOpenSliders((prev) => !prev);
  };

  const handleProductsClick = () => {
    setOpenProducts((prev) => !prev);
  };

  const handleCategoriesClick = () => {
    setOpenCategories((prev) => !prev);
  };

  const handleBlogsClick = () => {
    setOpenBlogs((prev) => !prev);
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev); // Manual toggle
  };

  return (
    <div
      className={`${
        collapsed ? "w-14" : "w-60"
      } h-[calc(100vh-64px)] bg-primary text-white rounded-lg shadow-sm flex flex-col transition-all ease-in-out duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex justify-between p-4">
        <div className="flex items-center"></div>
        <MenuIcon
          onClick={toggleSidebar}
          className="cursor-pointer text-white"
          sx={{ fontSize: 28 }}
        />
      </div>

      {/* Navigation List */}
      <List
        component="nav"
        className="flex-grow overflow-y-auto text-xs overflow-x-hidden"
      >
        <Link href="/" className="text-white">
          <ListItemButton>
            <ListItemIcon className="text-white">
              <HomeIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Home" className="text-xs" />}
          </ListItemButton>
        </Link>
        <Link href="/dashboard" className="text-white">
          <ListItemButton>
            <ListItemIcon className="text-white">
              <DashboardIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Dashboard" className="text-xs" />
            )}
          </ListItemButton>
        </Link>

        {/* Home Sliders with Submenu */}
        <ListItemButton onClick={handleSlidersClick}>
          <ListItemIcon>
            <HomeIcon className="text-white" />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Home Sliders" className="text-xs" />
          )}
          {openSliders ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSliders} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="pl-6">
            <Link href="/dashboard/home-banners">
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary="Home Banner List"
                    className="text-xs"
                  />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/home-banners/add">
              <ListItemButton>
                <ListItemIcon>
                  <AddIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary="Add Home Banner Slide"
                    className="text-xs"
                  />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/small-banners">
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary="Home Small Banner List"
                    className="text-xs"
                  />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/small-banners/add">
              <ListItemButton>
                <ListItemIcon>
                  <AddIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary="Add Small Banner"
                    className="text-xs"
                  />
                )}
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        {/* Blogs with Submenu */}
        <ListItemButton onClick={handleBlogsClick}>
          <ListItemIcon>
            <FaBloggerB size={24} className="text-white" />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Blogs" className="text-xs" />}
          {openBlogs ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openBlogs} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="pl-6">
            <Link href="/dashboard/blogs">
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary="Blog List" className="text-xs" />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/blogs/add">
              <ListItemButton>
                <ListItemIcon>
                  <AddIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary="Add New Blog" className="text-xs" />
                )}
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        {/* Users */}
        <Link href="/dashboard/users">
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon className="text-white" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Users" className="text-xs" />}
          </ListItemButton>
        </Link>

        {/* Products with Submenu */}
        <ListItemButton onClick={handleProductsClick}>
          <ListItemIcon>
            <ShoppingCartIcon className="text-white" />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Products" className="text-xs" />
          )}
          {openProducts ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProducts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="pl-6">
            <Link href="/dashboard/products">
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary="Products List" className="text-xs" />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/products/add">
              <ListItemButton>
                <ListItemIcon>
                  <AddIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary="Add Product" className="text-xs" />
                )}
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        {/* Categories with Submenu */}
        <ListItemButton onClick={handleCategoriesClick}>
          <ListItemIcon>
            <CategoryIcon className="text-white" />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Categories" className="text-xs" />
          )}
          {openCategories ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCategories} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="pl-6">
            <Link href="/dashboard/categories">
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary="Category List" className="text-xs" />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/categories/add">
              <ListItemButton>
                <ListItemIcon>
                  <AddIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary="Add Category" className="text-xs" />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/sub-categories">
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary="Subcategory List"
                    className="text-xs"
                  />
                )}
              </ListItemButton>
            </Link>
            <Link href="/dashboard/sub-categories/add">
              <ListItemButton>
                <ListItemIcon>
                  <AddIcon className="text-white" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary="Add Subcategory" className="text-xs" />
                )}
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        {/* Orders */}
        <Link href="/dashboard/orders">
          <ListItemButton>
            <ListItemIcon>
              <ShoppingCartIcon className="text-white" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Orders" className="text-xs" />
            )}
          </ListItemButton>
        </Link>

        {/* Logout */}
        <Link href="/logout">
          <ListItemButton className="mt-auto">
            <ListItemIcon>
              <LogoutIcon className="text-white" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Logout" className="text-xs" />
            )}
          </ListItemButton>
        </Link>
      </List>
    </div>
  );
};

export default Sidebar;
