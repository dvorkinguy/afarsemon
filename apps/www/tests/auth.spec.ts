import { test, expect, Page } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  let consoleMessages: string[] = [];
  let networkErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset arrays
    consoleMessages = [];
    networkErrors = [];

    // Listen for console messages
    page.on('console', (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Listen for network errors
    page.on('response', (response) => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.status()}: ${response.url()}`);
      }
    });
  });

  test('should load homepage and take screenshot', async ({ page }) => {
    console.log('Navigating to https://afarsemon.com');
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial page
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-initial.png', 
      fullPage: true 
    });
    
    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check if page loaded successfully
    expect(page.url()).toContain('afarsemon.com');
    
    // Log console messages
    console.log('Console messages:', consoleMessages);
    console.log('Network errors:', networkErrors);
  });

  test('should check login/auth interface functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for common login/auth elements
    const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign in"), [data-testid="login-button"]');
    const authLink = page.locator('a[href*="auth"], a[href*="login"], a[href*="signin"]');
    
    // Take screenshot of the current state
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-auth-check.png', 
      fullPage: true 
    });
    
    // Check if login elements are visible
    const loginButtonCount = await loginButton.count();
    const authLinkCount = await authLink.count();
    
    console.log(`Login buttons found: ${loginButtonCount}`);
    console.log(`Auth links found: ${authLinkCount}`);
    
    if (loginButtonCount > 0) {
      const buttonText = await loginButton.first().textContent();
      console.log(`Login button text: ${buttonText}`);
      
      // Check if button text is in Hebrew (the error message mentioned)
      const isHebrew = /[\u0590-\u05FF]/.test(buttonText || '');
      if (isHebrew) {
        console.log(`WARNING: Found Hebrew text in login button: ${buttonText}`);
      }
    }
    
    if (authLinkCount > 0) {
      const linkHref = await authLink.first().getAttribute('href');
      console.log(`Auth link href: ${linkHref}`);
      
      // Check if link contains localhost (the issue mentioned)
      if (linkHref?.includes('localhost')) {
        console.log(`ERROR: Auth link still contains localhost: ${linkHref}`);
      }
    }
  });

  test('should navigate to /auth page and test authentication flow', async ({ page }) => {
    console.log('Navigating to /auth page');
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of auth page
    await page.screenshot({ 
      path: 'tests/screenshots/auth-page-initial.png', 
      fullPage: true 
    });
    
    // Check if we're on the correct domain
    expect(page.url()).toContain('afarsemon.com');
    expect(page.url()).not.toContain('localhost');
    
    // Look for Google OAuth button or link
    const googleAuthButton = page.locator(
      'button:has-text("Google"), ' +
      'button:has-text("Sign in with Google"), ' +
      'button:has-text("Continue with Google"), ' +
      'a:has-text("Google"), ' +
      '[data-provider="google"], ' +
      '[data-testid="google-auth"]'
    );
    
    const googleAuthCount = await googleAuthButton.count();
    console.log(`Google auth buttons/links found: ${googleAuthCount}`);
    
    if (googleAuthCount > 0) {
      // Take screenshot with Google auth button visible
      await googleAuthButton.first().scrollIntoViewIfNeeded();
      await page.screenshot({ 
        path: 'tests/screenshots/auth-page-google-button.png', 
        fullPage: true 
      });
      
      const buttonText = await googleAuthButton.first().textContent();
      console.log(`Google auth button text: ${buttonText}`);
      
      // Check the href or action URL
      const href = await googleAuthButton.first().getAttribute('href');
      const formAction = await googleAuthButton.first().getAttribute('formaction');
      const clickHandler = await googleAuthButton.first().getAttribute('onclick');
      
      console.log(`Google auth href: ${href}`);
      console.log(`Google auth formaction: ${formAction}`);
      console.log(`Google auth onclick: ${clickHandler}`);
      
      // Verify URLs are using correct domain
      if (href && href.includes('localhost')) {
        console.log(`ERROR: Google auth href contains localhost: ${href}`);
      }
      if (formAction && formAction.includes('localhost')) {
        console.log(`ERROR: Google auth formaction contains localhost: ${formAction}`);
      }
    }
    
    // Look for any Hebrew error messages
    const hebrewText = await page.locator(':has-text("שגיאה")').count();
    if (hebrewText > 0) {
      console.log('WARNING: Found Hebrew error message on auth page');
      const errorText = await page.locator(':has-text("שגיאה")').first().textContent();
      console.log(`Hebrew error text: ${errorText}`);
    }
    
    console.log('Console messages on auth page:', consoleMessages);
    console.log('Network errors on auth page:', networkErrors);
  });

  test('should test Google OAuth flow initiation (without completion)', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    const googleAuthButton = page.locator(
      'button:has-text("Google"), ' +
      'button:has-text("Sign in with Google"), ' +
      'button:has-text("Continue with Google"), ' +
      'a:has-text("Google"), ' +
      '[data-provider="google"], ' +
      '[data-testid="google-auth"]'
    );
    
    if (await googleAuthButton.count() > 0) {
      console.log('Testing Google OAuth flow initiation...');
      
      // Listen for navigation events
      let navigationUrl = '';
      page.on('framenavigated', (frame) => {
        if (frame === page.mainFrame()) {
          navigationUrl = frame.url();
          console.log(`Navigation detected: ${navigationUrl}`);
        }
      });
      
      // Click the Google auth button but don't complete the flow
      try {
        await googleAuthButton.first().click();
        
        // Wait a bit for navigation to start
        await page.waitForTimeout(3000);
        
        // Take screenshot of where we ended up
        await page.screenshot({ 
          path: 'tests/screenshots/oauth-flow-initiated.png', 
          fullPage: true 
        });
        
        // Check if we were redirected to Google's OAuth
        if (navigationUrl.includes('accounts.google.com') || navigationUrl.includes('oauth.googleusercontent.com')) {
          console.log('SUCCESS: Google OAuth flow initiated correctly');
          console.log(`OAuth URL: ${navigationUrl}`);
        } else if (navigationUrl.includes('localhost')) {
          console.log(`ERROR: OAuth redirected to localhost: ${navigationUrl}`);
        } else {
          console.log(`OAuth navigation URL: ${navigationUrl}`);
        }
        
      } catch (error) {
        console.log(`Error initiating OAuth: ${error}`);
        await page.screenshot({ 
          path: 'tests/screenshots/oauth-error.png', 
          fullPage: true 
        });
      }
    } else {
      console.log('No Google OAuth button found to test');
    }
  });

  test('should verify all URLs use afarsemon.com domain', async ({ page }) => {
    const pages = ['/', '/auth'];
    
    for (const pagePath of pages) {
      console.log(`Checking URLs on page: ${pagePath}`);
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Get all links on the page
      const links = await page.locator('a[href]').all();
      const localhostLinks: string[] = [];
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && href.includes('localhost')) {
          localhostLinks.push(href);
        }
      }
      
      // Get all form actions
      const forms = await page.locator('form[action]').all();
      const localhostForms: string[] = [];
      
      for (const form of forms) {
        const action = await form.getAttribute('action');
        if (action && action.includes('localhost')) {
          localhostForms.push(action);
        }
      }
      
      console.log(`Page ${pagePath} - Localhost links found: ${localhostLinks.length}`);
      console.log(`Page ${pagePath} - Localhost forms found: ${localhostForms.length}`);
      
      if (localhostLinks.length > 0) {
        console.log(`ERROR: Found localhost links on ${pagePath}:`, localhostLinks);
      }
      
      if (localhostForms.length > 0) {
        console.log(`ERROR: Found localhost forms on ${pagePath}:`, localhostForms);
      }
      
      // Verify current URL is correct
      expect(page.url()).toContain('afarsemon.com');
      expect(page.url()).not.toContain('localhost');
    }
  });

  test('should test diagnostic endpoints', async ({ page }) => {
    console.log('Testing diagnostic endpoints...');
    
    // Test health endpoint
    console.log('Testing /api/health endpoint');
    const healthResponse = await page.goto('/api/health');
    await page.waitForLoadState('networkidle');
    
    console.log(`Health endpoint status: ${healthResponse?.status()}`);
    
    if (healthResponse?.ok()) {
      const healthBody = await page.textContent('body');
      console.log(`Health endpoint response: ${healthBody}`);
    } else {
      console.log('ERROR: Health endpoint not accessible');
    }
    
    // Take screenshot of health response
    await page.screenshot({ 
      path: 'tests/screenshots/health-endpoint.png', 
      fullPage: true 
    });
    
    // Test auth config endpoint
    console.log('Testing /api/auth/check-config endpoint');
    const configResponse = await page.goto('/api/auth/check-config');
    await page.waitForLoadState('networkidle');
    
    console.log(`Config endpoint status: ${configResponse?.status()}`);
    
    if (configResponse?.ok()) {
      const configBody = await page.textContent('body');
      console.log(`Config endpoint response: ${configBody}`);
      
      // Try to parse as JSON to check the config values
      try {
        const configData = JSON.parse(configBody || '{}');
        console.log('Environment variable check:');
        console.log(`- NEXTAUTH_URL: ${configData.NEXTAUTH_URL}`);
        console.log(`- NEXTAUTH_SECRET exists: ${configData.NEXTAUTH_SECRET_EXISTS}`);
        console.log(`- GOOGLE_CLIENT_ID exists: ${configData.GOOGLE_CLIENT_ID_EXISTS}`);
        console.log(`- GOOGLE_CLIENT_SECRET exists: ${configData.GOOGLE_CLIENT_SECRET_EXISTS}`);
        
        // Check for localhost in NEXTAUTH_URL
        if (configData.NEXTAUTH_URL && configData.NEXTAUTH_URL.includes('localhost')) {
          console.log(`ERROR: NEXTAUTH_URL still contains localhost: ${configData.NEXTAUTH_URL}`);
        } else if (configData.NEXTAUTH_URL && configData.NEXTAUTH_URL.includes('afarsemon.com')) {
          console.log(`SUCCESS: NEXTAUTH_URL is correctly set to production: ${configData.NEXTAUTH_URL}`);
        }
      } catch (error) {
        console.log(`Could not parse config response as JSON: ${error}`);
      }
    } else {
      console.log('ERROR: Config endpoint not accessible');
    }
    
    // Take screenshot of config response
    await page.screenshot({ 
      path: 'tests/screenshots/config-endpoint.png', 
      fullPage: true 
    });
  });

  test('should test complete OAuth flow with detailed logging', async ({ page }) => {
    console.log('Testing complete OAuth flow with detailed logging...');
    
    // Start from auth page
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/oauth-detailed-initial.png', 
      fullPage: true 
    });
    
    // Check current URL
    console.log(`Current URL: ${page.url()}`);
    
    // Find Google OAuth button with more specific selectors
    const googleAuthSelectors = [
      'button:has-text("Google")',
      'button:has-text("Sign in with Google")',
      'button:has-text("Continue with Google")',
      'a:has-text("Google")',
      '[data-provider="google"]',
      '[data-testid="google-auth"]',
      'form[action*="google"] button',
      'form[action*="oauth"] button'
    ];
    
    let googleAuthButton = null;
    for (const selector of googleAuthSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        googleAuthButton = button.first();
        console.log(`Found Google auth element with selector: ${selector}`);
        break;
      }
    }
    
    if (!googleAuthButton) {
      console.log('No Google OAuth button found, checking page content...');
      const pageContent = await page.content();
      console.log('Page content preview (first 1000 chars):', pageContent.substring(0, 1000));
      
      // Look for any forms on the page
      const forms = await page.locator('form').all();
      console.log(`Found ${forms.length} forms on the page`);
      
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        const action = await form.getAttribute('action');
        const method = await form.getAttribute('method');
        console.log(`Form ${i}: action=${action}, method=${method}`);
      }
      
      return;
    }
    
    // Get button details
    const buttonText = await googleAuthButton.textContent();
    const buttonHref = await googleAuthButton.getAttribute('href');
    const buttonFormAction = await googleAuthButton.getAttribute('formaction');
    
    console.log(`Button text: "${buttonText}"`);
    console.log(`Button href: ${buttonHref}`);
    console.log(`Button formaction: ${buttonFormAction}`);
    
    // Scroll button into view and take screenshot
    await googleAuthButton.scrollIntoViewIfNeeded();
    await page.screenshot({ 
      path: 'tests/screenshots/oauth-detailed-button.png', 
      fullPage: true 
    });
    
    // Set up navigation monitoring
    let redirectUrl = '';
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        redirectUrl = frame.url();
        console.log(`Navigation event: ${redirectUrl}`);
      }
    });
    
    // Monitor network requests
    const networkRequests: string[] = [];
    page.on('request', (request) => {
      networkRequests.push(`${request.method()} ${request.url()}`);
    });
    
    try {
      console.log('Clicking Google OAuth button...');
      
      // Click the button
      await googleAuthButton.click();
      
      // Wait for navigation or timeout
      try {
        await page.waitForURL('**/*', { timeout: 5000 });
      } catch (error) {
        console.log('No navigation detected within 5 seconds');
      }
      
      // Wait a bit more for any async operations
      await page.waitForTimeout(3000);
      
      // Take screenshot of current state
      await page.screenshot({ 
        path: 'tests/screenshots/oauth-detailed-after-click.png', 
        fullPage: true 
      });
      
      const currentUrl = page.url();
      console.log(`URL after click: ${currentUrl}`);
      
      // Analyze the result
      if (currentUrl.includes('accounts.google.com')) {
        console.log('SUCCESS: Redirected to Google OAuth');
      } else if (currentUrl.includes('oauth.googleusercontent.com')) {
        console.log('SUCCESS: On Google OAuth domain');
      } else if (currentUrl.includes('localhost')) {
        console.log(`ERROR: Redirected to localhost: ${currentUrl}`);
      } else if (currentUrl === page.url()) {
        console.log('WARNING: No navigation occurred - stayed on same page');
      } else {
        console.log(`INFO: Navigated to: ${currentUrl}`);
      }
      
      // Log recent network requests
      console.log('Recent network requests:');
      networkRequests.slice(-10).forEach(req => console.log(`  ${req}`));
      
    } catch (error) {
      console.log(`Error during OAuth flow test: ${error}`);
      await page.screenshot({ 
        path: 'tests/screenshots/oauth-detailed-error.png', 
        fullPage: true 
      });
    }
    
    // Check console for any JavaScript errors
    console.log('JavaScript console messages during OAuth test:', consoleMessages);
    console.log('Network errors during OAuth test:', networkErrors);
  });

  test.afterEach(async ({ page }) => {
    // Final console and network error summary
    if (consoleMessages.length > 0) {
      console.log('Final console messages:', consoleMessages);
    }
    if (networkErrors.length > 0) {
      console.log('Final network errors:', networkErrors);
    }
  });
});