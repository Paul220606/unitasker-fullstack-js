import { useTranslation } from "react-i18next"

import translateItem from "../utils/translateItem"
function StatsDisplay({stats}) {
    const {t} = useTranslation()
    return (
    <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
            <div className="col-md-3" key={index}>
                <div className="card bg-dark text-light shadow-sm p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-light mb-1">{translateItem(stat.title, "title", t)}</h6>
                            <h3 className="fw-bold mb-0">{stat.value}</h3>
                        </div>
                        <i className={`bi ${stat.icon} fs-1 opacity-50`}></i>
                    </div>
                </div>
            </div>
        ))}
    </div>
    )
}

export default StatsDisplay