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
import Form from '../Form/component.jsx'
import ScrollTo from '../ScrollTo/component.jsx'
import FormGroup from '../FormGroup/component'
import Textarea from '../Textarea/component'
import Button from '../Button/component.jsx'
import { ErrorSummary, ErrorMessage, getErrors } from '../FormErrors/component'
import SuccessMessage from '../FormSuccess/component'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { contentFulFactory } from '../../contentful'

export default class PageFeedbackForm extends React.Component {
  static defaultProps = {
    errors: [],
    error: false
  }

  constructor(props) {
    super(props)
    this.state = {
      subject: '',
      feedback: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.submitForm(this.state)
  }

  render() {
    let errors = this.props.error ? getErrors(this.props.errors) : []

    return (
      <React.Fragment>
        <Masthead path={this.props.location}/>
        <Accent className='accent--shallow'>
          <Heading type='h1' className='h2 inverted spacing-left spacing--single' text={this.props.pageData.title} />
        </Accent>
        <Main className='main--muted main--full-width'>
          <Accent>
            <Grid>
              <GridCol className='col-12 col-sm-7 col-md-6 offset-md-2'>

                {this.props.pageData.fields.body &&
                  <div className="spacing-bottom--single" dangerouslySetInnerHTML={{
                    __html: documentToHtmlString(this.props.pageData.fields.body, contentFulFactory())
                  }}/>
                }

                {this.props.error &&
                  <ScrollTo>
                    <ErrorSummary ref={this.formMessage} errors={this.props.errors} />
                  </ScrollTo>
                }

                {this.props.submitted &&
                  <ScrollTo>
                    <SuccessMessage>Thank you for your feedback!</SuccessMessage>
                  </ScrollTo>
                }

                {!this.props.submitted &&
                <Form className='spacing-bottom--large' handleSubmit={this.handleSubmit}>
                  <FormGroup className='form-control--reversed form-control--large' label="Subject" id="subject" name="subject" value={this.state.subject} onChange={this.handleChange} error={errors.subject} hint="Must be less than 100 characters" />
                  <Textarea label="Feedback" id="feedback" name="feedback" value={this.state.feedback} onChange={this.handleChange} error={errors.feedback} hint="Must be less than 500 characters" />
                  <Button className='btn--primary' disabled={this.props.loading}>
                    Send feedback
                  </Button>
                </Form>
                }
              </GridCol>
            </Grid>
          </Accent>
        </Main>
        <Footer />
        <GA/>
      </React.Fragment>
    )
  }
}