import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <Nav />
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayout;
