var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');

function SelectLanguage(props) {
    var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];

    return (
        <ul className='languages'>
            {languages.map((lang) => {
                return (
                    <li
                    style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}
                    key={lang} onClick={props.onSelect.bind(null, lang)}>
                        {lang}
                    </li>
                )
            })}

        </ul>
    );
}

function RepoGrid(props) {
    return(
        <ul className="popular-list">
            {props.repos.map(function(repo, index) {
                return (
                    <li key={repo.name} className='popular-item'>
                        <div className='popular-rank'>#{index + 1} </div>
                        <ul className='space-list-items'>
                            <li>
                                <img className="avatar" src={repo.owner.avatar_url} alt={'Avatar for ' + repo.owner.login}/>
                            </li>
                            <li>
                                <a href={repo.html_url}>{repo.name}</a>
                            </li>
                            <li>
                                @{repo.owner.login}
                            </li>
                            <li>
                                {repo.stargazers_count} stars
                            </li>
                        </ul>
                    </li>
                )
            })}

        </ul>
    )
}

RepoGrid.PropTypes = {
        repos: PropTypes.array.isRequired,
}

class Popular extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedLanguage: 'All',
            repos: null,
        }

        this.updateLanguage = this.updateLanguage.bind(this);
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage);
    }

    updateLanguage (lang){
        this.setState(function(){
            return {
                selectedLanguage: lang,
                repos: null
            }
        })

        api.fetchPopularRepos(lang)
            .then(function(response) {
                this.setState(() => {
                    return {
                        repos: response,
                    }
                });
            }.bind(this));
    }

    render () {
        return (
            <div>
                <SelectLanguage
                selectedLanguage={this.state.selectedLanguage}
                onSelect={this.updateLanguage} />

                {this.state.repos ? <RepoGrid repos={this.state.repos}/> : <p>LOADING</p>}

            </div>
        )
    }
};

SelectLanguage.PropTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}

module.exports = Popular;
