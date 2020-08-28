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
		guild: "748512515637379113",
    prefix: '?',
    owners: ['501710994293129216', '381490382183333899'],
    roles: {
      TRIAL_MODERATOR: "748609282857107497",
      MODERATOR: "748609821074260099",
      SENIOR_MODERATOR: "748609976800378880",//(admin)
			STAFF_TEAM: "748610501654609980"
    },
		channels: {
			MOD_LOG: "748914243524363283"
		},
		colors: {
			RED: "#f56c6c"
		},
		emoji: {
			TICK: "<:tick:748921894107086862>",
			ERR: "<:error:748922603909152799>"
		}
  }
};

module.exports = config;