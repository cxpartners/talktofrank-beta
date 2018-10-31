import React, { PureComponent } from 'react'
import classNames from 'classnames'
import Button from '../Button/component.jsx'
import Svg from '../Svg/component.jsx'
import Autosuggest from 'react-autosuggest'
import {browserHistory} from 'react-router'
import axios from 'axios'
import SearchResultDrug from '../SearchResultDrug/component'
import SearchResultContent from '../SearchResultContent/component'

class FormGroup extends PureComponent {
  constructor (props) {
    super(props)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getSuggestions = this.getSuggestions.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this)
    this.state = {
      id: '',
      searchTerm: '',
      currentSuggestion: '',
      autoCompleteData: [],
      resultsTotal: 0
    }
  }

  componentDidMount() {
    this.searchInput.input.focus()
  }

  onChange (event, { newValue }) {
    if (event.type === 'change') {
      this.setState({
        searchTerm: newValue,
        currentSuggestion: '',
        resultsTotal: 0
      })
    } else {
      this.setState({
        currentSuggestion: newValue
      })
    }
  }

  // @todo: refactor to container
  async getSuggestions (value) {
    const response = await axios
      .get(`/api/v1/search/autocomplete/${value}?page=0&pageSize=5`)
    return response.data
  }

  onSuggestionsFetchRequested ({ value }) {
    this.getSuggestions(value).then(resp => {
      this.setState({
        resultsTotal: resp.total,
        autoCompleteData: resp.hits
      })
    })
  }

  handleKeyPress (e) {
    // Theres a race condition with the keyup/onchange events
    // adding in a check
    if (e.key === 'Enter' && this.state.currentSuggestion === '') {
      e.preventDefault()
      const searchTerm = this.state.searchTerm
      window.location = `/search/${searchTerm}`
    }
  }

  // this prevents the thing from firing until at least two characters are added
  shouldRenderSuggestions(value) {
    return value.trim().length > 0
  }

  renderSuggestionsContainer({ containerProps, children, query }) {
    let res = this.state.resultsTotal > 5 ? (this.state.resultsTotal - 5) : null
    return (
      <div {...containerProps}>
        {children}
        {res && <a className='read-more' href={`/search/${this.state.searchTerm.toLowerCase()}`}>
          +{res} more results
        </a>}
      </div>
    )
  }

  onSuggestionSelected (event, suggestionItem) {
    event.preventDefault()
    const item = suggestionItem.suggestion._source
    let url = ''
    if (suggestionItem.suggestion._index.includes('talktofrank-content')) {
      url = item.type === 'news'
        ? `/news/${item.slug}`
        : item.slug
    } else {
      url = `/drug/${item.slug}`
      if (item.realName && item.realName !== item.name) {
        url += `?a=${item.name.trim()}`
      }
    }

    window.location = url
  }

  onSuggestionsClearRequested () {
    this.setState({
      autoCompleteData: []
    })
  }

  getSuggestionValue (suggestion) {
    // @todo: refactor to use config
    return suggestion._index.includes('talktofrank-content')
      ? suggestion._source.title
      : suggestion._source.name
  }

  renderSuggestion (result) {
    const SearchResultComponent =
      result._index.includes('talktofrank-content')
        ? SearchResultContent
        : SearchResultDrug

    return <SearchResultComponent
      item={result._source}
      prefix={true}
      searchTerm={this.state.searchTerm}
      highlight={result.highlight
        ? result.highlight
        : null
      }
    />
  }

  render () {
    let classes = classNames('input-group', this.props.className)
    const { searchTerm, autoCompleteData } = this.state
    const { id, labelHidden, label, button } = this.props

    return (
      <div className={classes}>
        <label htmlFor={id} className='form-label h3'>{label}</label>
        <Autosuggest
          suggestions={autoCompleteData}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={{
            className: 'form-control',
            id: id,
            value: searchTerm,
            onKeyDown: this.handleKeyPress,
            onChange: this.onChange,
            placeholder: this.props.placeholder,
            type: 'search',
            role: 'combobox'
          }}
          ref={input => { this.searchInput = input }}
          required
        />
      </div>
    )
  }
}

export default FormGroup
