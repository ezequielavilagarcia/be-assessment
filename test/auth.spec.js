describe('Authentication and authorization', () => {
  describe('Login', () => {
    describe('User exists', () => {
      it('Should has a role');
      it('Should has an authentication token');
    });
    describe('User does not exists', () => {
      it('Should return an specific message');
      it('Should return not found api code');
    });
  });
});
