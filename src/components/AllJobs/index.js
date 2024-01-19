import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImage =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileData: {},
    jobsData: [],
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = `https://apis.ccbp.in/profile`
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const responseProfile = await fetch(profileApiUrl, optionsProfile)

    const data = await responseProfile.json()
    if (responseProfile.ok === true) {
      const profile = data.profile_details
      const updatedDataProfile = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }

      this.setState({
        profileData: updatedDataProfile,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiStatusConstants.inProgress})
    const {activeCheckBoxList, activeSalaryRangeId, searchInput} = this.state
    const type = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const responseJobs = await fetch(jobsApiUrl, optionsJobs)
    const fetchedJobsData = await responseJobs.json()

    if (responseJobs.ok === true) {
      const updatedDataJobs = fetchedJobsData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSelectSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  onClickCheckbox = event => {
    const {activeCheckBoxList} = this.state

    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  onGetProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-icon" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onRetryProfile = () => this.getProfileData()

  onRetryJobs = () => this.getJobsData()

  onGetProfileFailureView = () => (
    <div className="failure-button-container">
      <h1> profile fail</h1>
      <button
        type="button"
        onClick={this.onRetryProfile}
        className="failure-button"
      >
        Retry
      </button>
    </div>
  )

  onGetJobsFailureView = () => (
    <div className="failure-image-button-container">
      <img alt="failure view" className="failure-img" src={failureViewImage} />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onGetJobsView = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length > 0
    return noOfJobs ? (
      <>
        <ul className="ul-job-items-container">
          {jobsData.map(eachItem => (
            <JobCard key={eachItem.id} jobData={eachItem} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          alt="no jobs"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      default:
        return null
    }
  }

  onRenderJobsStatus = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.onGetJobsView()
      case apiStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetCheckBoxesView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckbox}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonsView = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="input"
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onSelectSalaryRange}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onRenderSearch = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          className="search-input"
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          data-testid="searchButton"
          type="button"
          className="search-button"
          onClick={this.onSubmitSearchInput}
          aria-label="Search"
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="sm-search-container">{this.onRenderSearch()}</div>
          <div className="side-bar-container">
            {this.onRenderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckBoxesView()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.onGetRadioButtonsView()}
          </div>
          <div className="jobs-container">
            <div className="lg-search-container">{this.onRenderSearch()}</div>
            {this.onRenderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
