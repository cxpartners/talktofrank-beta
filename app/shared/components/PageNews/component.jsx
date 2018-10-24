import React from 'react'
import Accent from '../Accent/component'
import Masthead from '../Masthead/component'
import Divider from '../Divider/component'
import Heading from '../Heading/component'
import Footer from '../Footer/component'
import GA from '../GoogleAnalytics/component'
import Grid from '../Grid/component'
import GridCol from '../GridCol/component'
import Main from '../Main/component'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { contentFulFactory } from '../../contentful'

const PageNews = props => (
  <React.Fragment>
    <Masthead path={props.location}/>
    <Accent className='accent--shallow'>
      <Heading type='h1' className='h2 inverted spacing-left spacing--single' text={props.title} />
    </Accent>
    <Divider className='hr--muted' />
    <Main>
      <Grid>
        <GridCol className='col-12 col-md-8'>
          <div dangerouslySetInnerHTML={{
            __html: documentToHtmlString(props.fields.body, contentFulFactory())
          }} />
        </GridCol>
      </Grid>
    </Main>
    <Footer />
    <GA />
  </React.Fragment>
)

export default PageNews