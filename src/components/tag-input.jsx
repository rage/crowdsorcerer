// @flow
import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import type { TagType } from 'state/form/reducer';
import { addTagAction, removeTagAction } from 'state/form/actions';
import prefixer from 'utils/class-name-prefixer';
import FormValue from 'domain/form-value';
import Errors from 'components/errors';

class ExerciseTags extends Component {

  props: {
    tags: FormValue<Array<string>>,
    tagSuggestions: Array<string>,
    handleAddTag: (TagType) => void,
    handleRemoveTag: (string) => void,
    showErrors: boolean,
  }

  render() {
    const tags = this.props.tags.get().map(tag => ({ name: tag }));
    const tagSuggestions = this.props.tagSuggestions.map(tag => ({ name: tag }));
    return (
      <div className={prefixer('form-component')}>
        <ReactTags
          tags={tags}
          suggestions={tagSuggestions}
          handleDelete={this.props.handleRemoveTag}
          handleAddition={this.props.handleAddTag}
          allowNew
          autofocus={false}
          placeholder="Lisää uusi tagi"
        />
        <Errors errors={this.props.tags.errors} show={this.props.showErrors} />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    tags: state.form.tags,
    tagSuggestions: state.form.tagSuggestions,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleAddTag(tag: TagType) {
      dispatch(addTagAction(tag.name));
    },
    handleRemoveTag(tagIndex: number) {
      dispatch(removeTagAction(tagIndex));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseTags);
