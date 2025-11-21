import { Outlet } from "react-router-dom"
import { Navbar, Footer } from '../../components';
import './AnotherLayout.css';

const AnotherLayout = () => {

    return (
        <div className="layout-wrapper">
            <Navbar />
            <main className="layout-content">
                <Outlet/>
            </main>
            <Footer />
        </div>
    )
}

export default AnotherLayout