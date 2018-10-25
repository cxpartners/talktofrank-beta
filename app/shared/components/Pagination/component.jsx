import React from 'react'

const BreakView = (props) => {
  const label = props.breakLabel
  const className = props.breakClassName || 'break'

  return (
    <li className={className}>
      {label}
    </li>
  )
}

const PageView = (props) => {
  const onClick = props.onClick
  let className = props.pageClassName
  let ariaLabel = `Page ${props.page} ${(props.extraAriaContext ? ' ' + props.extraAriaContext : '')}`
  let ariaCurrent = null

  if (props.current) {
    ariaCurrent = 'true'
    ariaLabel = `Current page, ${props.page}`
    if (typeof (className) !== 'undefined') {
      className = className + ' ' + props.activeClassName
    } else {
      className = props.activeClassName
    }
  }

  return (
    <li className={className}>
      <a onClick={onClick}
       role='button'
       className={props.pageLinkClassName}
       href={props.href}
       tabIndex='0'
       aria-label={ariaLabel}
       aria-current={ariaCurrent}
       onKeyPress={onClick}>
      {props.page}
      </a>
    </li>
  )
}

export default class PaginationBoxView extends React.PureComponent {
  static defaultProps = {
    pageCount: 10,
    pageRangeDisplayed: 2,
    marginPagesDisplayed: 3,
    activeClassName: 'pagination__item--current',
    previousClassName: 'pagination__item--previous',
    nextClassName: 'pagination__item--next',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    breakLabel: '...',
    disabledClassName: 'pagination__item--disabled',
    disableInitialCallback: false
  }

  constructor (props) {
    super(props)

    this.state = {
      current
        : props.initialPage ? props.initialPage
        : props.forcePage ? props.forcePage
        : 0
    }
  }

  componentDidMount () {
    const { initialPage, disableInitialCallback } = this.props
    if (typeof (initialPage) !== 'undefined' && !disableInitialCallback) {
      this.callCallback(initialPage)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (typeof (nextProps.forcePage) !== 'undefined' && this.props.forcePage !== nextProps.forcePage) {
      this.setState({current: nextProps.forcePage})
    }
  }

  handlePreviousPage = e => {
    const { current } = this.state
    e.preventDefault ? e.preventDefault() : (e.returnValue = false)
    if (current > 0) {
      this.handlePagecurrent(current - 1, e)
    }
  }

  handleNextPage = e => {
    const { current } = this.state
    const { pageCount } = this.props

    e.preventDefault ? e.preventDefault() : (e.returnValue = false)
    if (current < pageCount - 1) {
      this.handlePagecurrent(current + 1, e)
    }
  }

  handlePagecurrent = (current, e) => {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false)

    if (this.state.current === current) return

    this.setState({current: current})
    this.callCallback(current)
  }

  hrefBuilder (pageIndex) {
    const { hrefBuilder, pageCount } = this.props
    if (hrefBuilder &&
      pageIndex !== this.state.current &&
      pageIndex >= 0 &&
      pageIndex < pageCount
    ) {
      return hrefBuilder(pageIndex + 1)
    }
  }

  callCallback = (currentItem) => {
    if (typeof (this.props.onPageChange) !== 'undefined' &&
        typeof (this.props.onPageChange) === 'function') {
      this.props.onPageChange({
        current: currentItem
      })
    }
  }

  getPageElement (index) {
    const { current } = this.state
    const {
      pageClassName,
      pageLinkClassName,
      activeClassName,
      extraAriaContext
    } = this.props

    return <PageView
      key={index}
      onClick={this.handlePagecurrent.bind(null, index)}
      current={current === index}
      pageClassName={pageClassName}
      pageLinkClassName={pageLinkClassName}
      activeClassName={activeClassName}
      extraAriaContext={extraAriaContext}
      href={this.hrefBuilder(index)}
      page={index + 1} />
  }

  pagination = () => {
    const items = []
    const {
      pageRangeDisplayed,
      pageCount,
      marginPagesDisplayed,
      breakLabel,
      breakClassName
    } = this.props

    const { current } = this.state

    if (pageCount <= pageRangeDisplayed) {
      for (let index = 0; index < pageCount; index++) {
        items.push(this.getPageElement(index))
      }
    } else {
      let leftSide = (pageRangeDisplayed / 2)
      let rightSide = (pageRangeDisplayed - leftSide)

      if (current > pageCount - pageRangeDisplayed / 2) {
        rightSide = pageCount - current
        leftSide = pageRangeDisplayed - rightSide
      } else if (current < pageRangeDisplayed / 2) {
        leftSide = current
        rightSide = pageRangeDisplayed - leftSide
      }

      let index
      let page
      let breakView
      let createPageView = (index) => this.getPageElement(index)

      for (index = 0; index < pageCount; index++) {
        page = index + 1

        if (page <= marginPagesDisplayed) {
          items.push(createPageView(index))
          continue
        }

        if (page > pageCount - marginPagesDisplayed) {
          items.push(createPageView(index))
          continue
        }

        if ((index >= current - leftSide) && (index <= current + rightSide)) {
          items.push(createPageView(index))
          continue
        }

        if (breakLabel && items[items.length - 1] !== breakView) {
          breakView = (
            <BreakView
              key={index}
              breakLabel={breakLabel}
              breakClassName={breakClassName}
            />
          )
          items.push(breakView)
        }
      }
    }

    return items
  }

  render () {
    const {
      disabledClassName,
      previousClassName,
      nextClassName,
      pageCount,
      containerClassName,
      previousLinkClassName,
      previousLabel,
      nextLinkClassName,
      nextLabel
    } = this.props

    const { current } = this.state

    const previousClasses = previousClassName + (current === 0 ? ` ${disabledClassName}` : '')
    const nextClasses = nextClassName + (current === pageCount - 1 ? ` ${disabledClassName}` : '')

    return (
      <nav role='navigation' aria-label='Pagination Navigation'>
        <ul className={containerClassName}>
          <li className={previousClasses}>
            <a onClick={this.handlePreviousPage}
               className={previousLinkClassName}
               href={this.hrefBuilder(current - 1)}
               tabIndex='0'
               role='button'
               onKeyPress={this.handlePreviousPage}>
              {previousLabel}
            </a>
          </li>

          {this.pagination()}

          <li className={nextClasses}>
            <a onClick={this.handleNextPage}
               className={nextLinkClassName}
               href={this.hrefBuilder(current + 1)}
               tabIndex='0'
               role='button'
               onKeyPress={this.handleNextPage}>
              {nextLabel}
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}