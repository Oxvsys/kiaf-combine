import facebook


class Facebook:
    """ Facebook class to fetch the user info and return it """

    @staticmethod
    def validate(auth_token):
        """ Validate method queries the facebook GraphAPI to fetch the user info """
        try:
            graph = facebook.GraphAPI(access_token=auth_token)
            profile = graph.request('/me?fields=name,email,picture')
            return profile

        except:
            return "The token is invalid or expired"
