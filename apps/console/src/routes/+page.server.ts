const in2035 = new Date('2035-01-01');
export const actions = {
  // This action is called when the user clicks the theme button
  setTheme: async ({ cookies, request }) => {
    const formData = await request.formData();
    const theme = formData.get('theme')?.toString() ?? 'skeleton';
    // Sets the selected theme to the cookie
    cookies.set('theme', theme, { path: '/', expires: in2035 });
    return { theme };
  },
};
