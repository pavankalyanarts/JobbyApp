import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Header from '../Header'
import JobsItem from '../JobsItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
    isChecked: false,
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
    isChecked: false,
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
    isChecked: false,
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
    isChecked: false,
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobsFeed extends Component {
  constructor() {
    super()
    this.state = {
      employmentList: employmentTypesList,
      userProfileData: {},
      jobsListData: [],
      profileStatus: apiStatus.initial,
      jobsStatus: apiStatus.initial,
      employmentType: '',
      minPackage: '',
      searchInput: '',
    }
  }

  componentDidMount() {
    this.fetchProfileData()
    this.fetchJobData()
  }

  fetchProfileData = async () => {
    this.setState({profileStatus: apiStatus.inProgress})

    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const formatData = {profileDetails: data.profile_details}
      const {profileDetails} = formatData
      const profileData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileStatus: apiStatus.success,
        userProfileData: profileData,
      })
    } else {
      this.setState({profileStatus: apiStatus.failure})
    }
  }

  fetchJobData = async () => {
    this.setState({jobsStatus: apiStatus.inProgress})
    const {employmentType, minPackage, searchInput} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minPackage}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const {jobs} = data
      const allJobs = jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({jobsStatus: apiStatus.success, jobsListData: allJobs})
    } else {
      this.setState({jobsStatus: apiStatus.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onUserEnterSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  renderSearchBarSmall = () => (
    <>
      <div className="search-box-sm">
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          onChange={this.onUserEnterSearch}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-btn"
          onClick={this.fetchJobData}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    </>
  )

  renderSearchBarlarge = () => (
    <>
      <div className="search-box-lg">
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          onChange={this.onUserEnterSearch}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-btn"
          onClick={this.fetchJobData}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    </>
  )

  renderUserProfile = () => {
    const {userProfileData} = this.state
    const {name, profileImageUrl, shortBio} = userProfileData
    return (
      <div className="user-profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="failure-profile-container">
      <button
        className="failure-btn"
        type="button"
        onClick={this.fetchProfileData}
      >
        Retry
      </button>
    </div>
  )

  userProfileCheckAndRender = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiStatus.success:
        return this.renderUserProfile()
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  sendEmploymentData = () => {
    const employmentArray = []
    const {employmentList} = this.state
    const getEmploymentType = employmentList.map(eachItem => {
      if (eachItem.isChecked) {
        employmentArray.push(eachItem.employmentTypeId)
      }
      return eachItem
    })

    this.setState(
      {
        employmentType: employmentArray.join(','),
        employmentList: getEmploymentType,
      },
      this.fetchJobData,
    )
  }

  onSelectedEmployment = event => {
    this.setState(
      prevState => ({
        employmentList: prevState.employmentList.map(eachItem => {
          if (event.target.value === eachItem.employmentTypeId) {
            return {
              label: eachItem.label,
              employmentTypeId: eachItem.employmentTypeId,
              isChecked: event.target.checked,
            }
          }
          return eachItem
        }),
      }),
      this.sendEmploymentData,
    )
  }

  renderEmploymentFilter = () => {
    const {employmentList} = this.state
    return (
      <div className="employment-filter-container">
        <h1 className="filter-heading">Type of Employment</h1>
        <ul className="employment-list">
          {employmentList.map(eachItem => (
            <li key={eachItem.employmentTypeId} className="employment-item">
              <input
                type="checkbox"
                className="check-box"
                id={eachItem.employmentTypeId}
                value={eachItem.employmentTypeId}
                onClick={this.onSelectedEmployment}
              />
              <label
                htmlFor={eachItem.employmentTypeId}
                className="filter-labels"
              >
                {eachItem.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onSalarySelected = event => {
    this.setState({minPackage: event.target.value}, this.fetchJobData)
  }

  renderSalaryFilter = () => (
    <div className="salary-filter-container">
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="salary-list">
        {salaryRangesList.map(eachItem => (
          <li key={eachItem.salaryRangeId} className="salary-item">
            <input
              type="radio"
              className="radio-ring"
              id={eachItem.salaryRangeId}
              value={eachItem.salaryRangeId}
              name="salary"
              onClick={this.onSalarySelected}
            />
            <label htmlFor={eachItem.salaryRangeId} className="filter-labels">
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderProfileFilters = () => (
    <div className="filters-section-container">
      {this.renderSearchBarSmall()}
      {this.userProfileCheckAndRender()}
      <hr />
      {this.renderEmploymentFilter()}
      <hr />
      {this.renderSalaryFilter()}
    </div>
  )

  renderAvailableJobs = () => {
    const {jobsListData} = this.state
    const isJobsAvailable = jobsListData.length > 0

    return (
      <>
        {isJobsAvailable ? (
          <div className="jobs-display-container">
            {this.renderSearchBarlarge()}

            <ul className="jobs-list">
              {jobsListData.map(eachJob => (
                <JobsItem key={eachJob.id} job={eachJob} />
              ))}
            </ul>
          </div>
        ) : (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-job-img"
            />
            <h1 className="no-job-main">No Jobs Found</h1>
            <p className="no-job-details">
              We could not find any jobs. Try other filters.
            </p>
          </div>
        )}
      </>
    )
  }

  renderJobsFailure = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-api-img"
      />
      <h1 className="failure-main">Oops! Something Went Wrong</h1>
      <p className="failure-details">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="failure-btn" type="button" onClick={this.fetchJobData}>
        Retry
      </button>
    </div>
  )

  checkAndRenderJobs = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case apiStatus.success:
        return this.renderAvailableJobs()
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobsFeed-page-container">
        <Header />
        <div className="jobs-filter-profile-container">
          {this.renderProfileFilters()}
          {this.checkAndRenderJobs()}
        </div>
      </div>
    )
  }
}

export default JobsFeed
