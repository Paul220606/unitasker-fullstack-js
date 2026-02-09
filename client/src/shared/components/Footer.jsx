import { Link } from "react-router-dom"

function Footer() {
  return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
            <div className="container">
                <div className="row">

                    <div className="col-md-4 mb-4">
                    <h5 className="fw-bold">Unitasker</h5>
                    <p className="text-secondary small">
                    Get small things done, with real people.
                    </p>
                    </div>

                    <div className="col-md-4 mb-4">
                    <h6 className="fw-semibold">Quick Links</h6>
                    <ul className="list-unstyled small">
                    <li>
                    <Link to="/" className="text-secondary text-decoration-none">
                        Home
                    </Link>
                    </li>
                    <li>
                    <Link to="/tasks" className="text-secondary text-decoration-none">
                        Browse Tasks
                    </Link>
                    </li>
                    <li>
                    <Link to="/about" className="text-secondary text-decoration-none">
                        About
                    </Link>
                    </li>
                    </ul>
                    </div>

                    <div className="col-md-4 mb-4">
                    <h6 className="fw-semibold">Connect</h6>
                    <p className="text-secondary small mb-2">
                    support@unitasker.com
                    </p>
                    <div className="d-flex gap-3">
                    <i className="bi bi-facebook fs-5"></i>
                    <i className="bi bi-twitter fs-5"></i>
                    <i className="bi bi-github fs-5"></i>
                    </div>
                    </div>

                </div>

                <hr className="border-secondary" />

                <div className="text-center text-secondary small">
                © {new Date().getFullYear()} Unitasker. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
