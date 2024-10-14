import styles from "./sidebar.module.css";

interface Arguments{
  sidebarVisible: boolean,
  children: React.ReactNode
}

export default function Sidebar({sidebarVisible, children}:Arguments) {
  return (
    <div className={"col-xs-12 col-sm-3 " + styles.sidebar + (sidebarVisible ? " visible" : " invisible")}>
      {children}
    </div>
  );
}