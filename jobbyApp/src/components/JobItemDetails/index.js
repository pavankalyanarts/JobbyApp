import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaExternalLinkAlt} from 'react-icons/fa'

import Header from '../Header'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  constructor() {
    super()
    this.state = {
      apiResponseStatus: apiStatus.initial,
      jobItemDetails: {},
      similarJobItems: [],
      jobItemSkills: [],
      lifeAtCompany: {},
    }
  }

  componentDidMount() {
    this.fetchJobItemData()
  }

  fetchJobItemData = async () => {
    this.setState({
      apiResponseStatus: apiStatus.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const jobData = data.job_details
      const similarJobData = data.similar_jobs
      const jobDetails = {
        companyLogoUrl: jobData.company_logo_url,
        companyWebsiteUrl: jobData.company_website_url,
        employmentType: jobData.employment_type,
        id: jobData.id,
        jobDescription: jobData.job_description,
        skills: jobData.skills.map(eachItem => ({
          imageUrl: eachItem.image_url,
          name: eachItem.name,
        })),
        title: jobData.title,
        lifeAtCompany: jobData.life_at_company,
        location: jobData.location,
        packagePerAnnum: jobData.package_per_annum,
        rating: jobData.rating,
      }
      const similarJobsDetails = similarJobData.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        apiResponseStatus: apiStatus.success,
        jobItemDetails: jobDetails,
        similarJobItems: similarJobsDetails,
        jobItemSkills: jobDetails.skills,
        lifeAtCompany: jobDetails.lifeAtCompany,
      })
    } else {
      this.setState({apiResponseStatus: apiStatus.failure})
    }
  }

  renderSkills = () => {
    const {jobItemSkills} = this.state
    return (
      <div className="skills-section-container">
        <h1 className="sub-heading">Skills</h1>
        <ul className="skills-list-container">
          {jobItemSkills.map(eachSkill => (
            <li key={eachSkill.name} className="skill-item">
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skill-img"
              />
              <p className="skill-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLifeAtCompany = () => {
    const {lifeAtCompany} = this.state

    return (
      <div className="lifeAtCompany-section-container">
        <div className="company-details-container">
          <h1 className="sub-heading">Life at Company</h1>
          <p className="general-description">{lifeAtCompany.description}</p>
        </div>
        <img
          src={lifeAtCompany.image_url}
          alt="life at company"
          className="company-img"
        />
      </div>
    )
  }

  renderJobItemDetails = () => {
    const {jobItemDetails} = this.state
    const {
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      packagePerAnnum,
    } = jobItemDetails

    return (
      <div className="jobItem-details-container">
        <div className="job-item-brief-section-1">
          <div className="job-item-details-1">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-item-logo-img"
            />
            <div className="job-item-title-rating">
              <h1 className="job-item-title">{title}</h1>
              <div className="item-rating-tab">
                <AiFillStar size={17} style={{color: '#fbbf24'}} />
                <p className="company-item-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-details-2">
            <div className="item-location-employment-details">
              <div className="location-item-tab">
                <MdLocationOn size={14} style={{color: '#f1f5f9'}} />
                <p className="item-loc-type-text">{location}</p>
              </div>
              <div className="employment-item-tab">
                <BsFillBriefcaseFill size={14} style={{color: '#f1f5f9'}} />
                <p className="item-loc-type-text">{employmentType}</p>
              </div>
            </div>
            <p className="job-item-salary">{packagePerAnnum}</p>
          </div>
        </div>
        <hr />
        <div className="job-item-brief-section-2">
          <div className="about-job-container">
            <h1 className="main-sub-heading">Description</h1>
            <a href={companyWebsiteUrl} className="company-website">
              Visit <FaExternalLinkAlt size={10} />
            </a>
          </div>

          <p className="general-description">{jobDescription}</p>
        </div>
        {this.renderSkills()}
        {this.renderLifeAtCompany()}
      </div>
    )
  }

  renderSimilarJobItems = () => {
    const {similarJobItems} = this.state

    return (
      <div className="similar-jobs-section-container">
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-job-list">
          {similarJobItems.map(eachJob => (
            <li key={eachJob.id} className="similar-job-item">
              <div className="job-item-brief-section-1">
                <div className="job-item-details-1">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-item-logo-img"
                  />
                  <div className="job-item-title-rating">
                    <h1 className="job-item-title">{eachJob.title}</h1>
                    <div className="item-rating-tab">
                      <AiFillStar size={17} style={{color: '#fbbf24'}} />
                      <p className="company-item-rating">{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="job-item-brief-section-2">
                  <h1 className="sub-heading">Description</h1>

                  <p className="general-description">
                    {eachJob.jobDescription}
                  </p>
                </div>
                <div className="job-item-details-2">
                  <div className="item-location-employment-details">
                    <div className="location-item-tab">
                      <MdLocationOn size={14} style={{color: '#f1f5f9'}} />
                      <p className="item-loc-type-text">{eachJob.location}</p>
                    </div>
                    <div className="employment-item-tab">
                      <BsFillBriefcaseFill
                        size={14}
                        style={{color: '#f1f5f9'}}
                      />
                      <p className="item-loc-type-text">
                        {eachJob.employmentType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="jobItem-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="failure-jobItem-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-main">Oops! Something went Wrong</h1>
      <p className="fail-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.fetchJobItemData}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsPage = () => (
    <>
      {this.renderJobItemDetails()}
      {this.renderSimilarJobItems()}
    </>
  )

  checkAndRenderJobItem = () => {
    const {apiResponseStatus} = this.state
    switch (apiResponseStatus) {
      case apiStatus.success:
        return this.renderJobDetailsPage()
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobDetails-page-container">
        <Header />
        {this.checkAndRenderJobItem()}
      </div>
    )
  }
}

export default JobItemDetails
