import React from 'react'
import Masthead from '../Masthead/component.jsx'
import Grid from '../Grid/component.jsx'
import GridCol from '../GridCol/component.jsx'
import Heading from '../Heading/component.jsx'
import Footer from '../Footer/component.jsx'
import Main from '../Main/component.jsx'
import Nav from '../Nav/component.jsx'
import Divider from '../Divider/component.jsx'
import Accent from '../Accent/component.jsx'
import LinkDrugName from '../LinkDrugName/component.jsx'
import GA from '../GoogleAnalytics/component.jsx'

const DrugList = props => {
  const limit = 4
  // @refactor @joel - drag this out into the container to map it nicely
  const initialLetter = props.list.map(val => {
    return {
      label: val.group,
      url: '#' + val.group,
      tracking: {
        category: 'A-Z list nav',
        action: 'Link click',
        label: val.group
      }
    }
  })

  return (
    <React.Fragment>
      <Masthead path={props.location}/>
      <Accent className='accent--shallow'>
        <Heading type='h1' className='h2 inverted spacing-left spacing--single' text='Drugs A to Z'/>
        <Nav navigation={initialLetter} className='navbar-expand navbar-list' labelledBy='drugs-a-z-navigation' id='drugs-a-z-navigation'/>
      </Accent>
      <Divider className='hr--muted' />
      <Main>
        <Grid>
          <GridCol className='col-12 col-sm-8 offset-sm-2'>
            <ul className='list-unstyled' role='list'>
              {props.list.map((val, i) => {
                return (
                  <li id={val.group} key={'outer' + i}>
                    <Heading text={val.group} className={'display-4 heading--primary' + (i === 0 ? '' : ' spacing-top--large')}/>
                    <ul className='list-unstyled'>
                    {val.values.map((v, index) => {
                      // @refactor - please tidy this up : )
                      let synonyms
                      let realName = v.parent ? <strong>{v.parent}</strong> : null

                      if (v.synonyms) {
                        synonyms = v.synonyms.length > limit ? `${v.synonyms.splice(0, limit).join(' / ')} +${v.synonyms.length} more` : v.synonyms.join(' / ')
                      }

                      return (
                        <LinkDrugName key={index} {...v} synonyms={synonyms || null} realName={realName || null}/>
                      )
                    })}
                    </ul>
                    <small><a className='return-to-top' href='#app'>Return to top ^</a></small>
                  </li>
                )
              })}
            </ul>
          </GridCol>
        </Grid>
      </Main>
      <Footer />
      <GA />
    </React.Fragment>
  )
}
export default DrugList
