import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobsItem = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job

  return (
    <Link to={`/jobs/${id}`} className="link-dom">
      <li className="job-item-container">
        <div className="job-brief-section-1">
          <div className="job-details-1">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo-img"
            />
            <div className="job-title-rating">
              <h1 className="job-title">{title}</h1>
              <div className="rating-tab">
                <AiFillStar size={12} style={{color: '#fbbf24'}} />
                <p className="company-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-2">
            <div className="location-employment-details">
              <div className="location-tab">
                <MdLocationOn size={12} style={{color: '#f1f5f9'}} />
                <p className="loc-type-text">{location}</p>
              </div>
              <div className="employment-tab">
                <BsFillBriefcaseFill size={12} style={{color: '#f1f5f9'}} />
                <p className="loc-type-text">{employmentType}</p>
              </div>
            </div>
            <p className="job-salary">{packagePerAnnum}</p>
          </div>
        </div>
        <hr />
        <div className="job-brief-section-2">
          <h1 className="brief-heading">Description</h1>
          <p className="brief-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobsItem
