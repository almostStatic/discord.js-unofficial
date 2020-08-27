const config = {
  functions: {
		/**
		 * Extracts the ID of a mentioned user from its raw content 
		 * @param {string} mention String to extract mention ID from
		 */
		getID: function (mention) {
			if (!mention) return;
			const matches = mention.match(/^<@!?(\d+)>$/);
			if (!matches) return;
			const id = matches[1];
			return id;			
    },
    trim: (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str),
  },
  statics: {
    prefix: '?',
    owners: [],
    roles: {
      TRIAL_MODERATOR: "",
      MEMBER: "",
      MODERATOR: "",
      SENIOR_MODERATOR: ""//(admin)
    }
  }
};

module.exports = config;