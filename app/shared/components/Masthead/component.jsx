import React from 'react'
import classNames from 'classnames'
import Logo from '../Logo/component.jsx'
import Button from '../Button/component.jsx'
import FormGroupAutocomplete from '../FormGroupAutocomplete/component.jsx'
import Form from '../Form/component.jsx'
import Nav from '../Nav/component.jsx'
import Icon from '../Icon/component.jsx'
import { primary } from '../../fixtures/navigation.js'

export default class Masthead extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      mobileMenuOpen: false,
      searchOpen: false
    }
  }

  handleSearchClick () {
    this.setState({
      searchOpen: !this.state.searchOpen
    })
  }

  handleMenuClick () {
    this.setState({
      mobileMenuOpen: !this.state.mobileMenuOpen
    })
  }

  render () {
    let icon = {
      label: 'search',
      url: '/ui/svg/magnifying.svg'
    }
    let iconClose = {
      label: 'close',
      url: '/ui/svg/cross.svg'
    }
    let classes = classNames('masthead', this.props.className)
    let navClasses = classNames('navbar-primary navbar-expand-md', {
      'd-none': !this.state.mobileMenuOpen
    })

    return (
      <section className={classes} role='banner'>
        <div className='masthead__inner'>
          <section className='navigation-wrapper'>
            <Button className={this.state.mobileMenuOpen ? 'navbar-toggler active' : 'navbar-toggler'} aria-controls='navigation' aria-expanded={this.state.mobileMenuOpen} aria-label={this.state.mobileMenuOpen ? 'Hide navigation' : 'Reveal navigation'} clickHandler={this.handleMenuClick.bind(this)}>
              {this.state.mobileMenuOpen ? 'Close' : 'Menu'}
            </Button>
            <Logo url='/ui/svg/logo-frank.svg' alt=''/>
            <Nav className={navClasses} id='navigation-primary' navigation={primary} current={this.props.path.pathname}/>
          </section>
          <Button className='btn--plain btn--static' clickHandler={this.handleSearchClick.bind(this)}><span className='hidden--sm'>Search </span><Icon {...icon}/></Button>
        </div>
        {this.state.searchOpen && <section className='masthead__takeover'>
          <div className='masthead__takeover__inner'>
            <Form>
              <FormGroupAutocomplete
                button='true'
                modifiers='form-control--search'
                className='input-group-autocomplete--inverse'
                id='search-masthead'
                label='Search for any drug'
                labelHidden='true'
                showContent={false}
                placeholder='Enter drug name (e.g. Mandy)'
              />
            </Form>
            <Button className='btn--plain' clickHandler={this.handleSearchClick.bind(this)}><Icon {...iconClose}/></Button>
          </div>
        </section>}
      </section>
    )
  }
}
