import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Terms of Service' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/terms' },
	];
};

export default function Terms() {
	return (
		<Article>
			<Section>
				<h1>Terms of Service</h1>
				<h2>Introduction</h2>
				<p>
					Welcome to Guise App! These Terms of Service ("Terms") govern your
					access to and use of the Guise App (the "Service"), provided by Guise
					App Creator. By accessing or using the Service, you agree to be bound
					by these Terms and our Privacy Policy. If you do not agree to these
					Terms, please do not use the Service.
				</p>

				<h2>About Guise App</h2>
				<p>
					Guise App is designed for developers and the Linux community, offering
					a powerful tool to create, customize, and share their favorite
					development tools and applications with unique thematic flavors. Our
					platform empowers you to personalize your environment, ensuring your
					tools not only function efficiently but also look exactly how you
					envision them.
				</p>

				<h2>User Responsibilities</h2>
				<ol>
					<li>
						<strong>Acceptable Use:</strong> You agree to use the Guise App
						solely for its intended purpose. You must not use the Service to
						create, share, or distribute any content that is illegal, harmful,
						defamatory, infringing, or otherwise objectionable.
					</li>
					<li>
						<strong>Content Ownership:</strong> You retain all intellectual
						property rights in the content (e.g., themes, configurations, custom
						tool definitions) that you create and submit through the Guise App.
						By submitting content, you grant Guise App a worldwide,
						non-exclusive, royalty-free, transferable, and sublicensable license
						to use, reproduce, distribute, prepare derivative works of, display,
						and perform the content in connection with the Service and Guise
						App's (and its successors' and affiliates') business, including
						without limitation for promoting and redistributing part or all of
						the Service (and derivative works thereof) in any media formats and
						through any media channels.
					</li>
					<li>
						<strong>Compliance:</strong> You are responsible for ensuring that
						your use of the Guise App and any content you create complies with
						all applicable local, national, and international laws and
						regulations.
					</li>
					<li>
						<strong>Security:</strong> You are responsible for maintaining the
						security of any accounts or credentials associated with your use of
						the Service, and for all activities that occur under your account.
					</li>
				</ol>

				<h2>Intellectual Property</h2>
				<p>
					The Guise App itself, including its software, design, logos, and
					trademarks, are the exclusive property of Guise App Creator and are
					protected by intellectual property laws. These Terms do not grant you
					any right, title, or interest in the Guise App or its content, except
					for the limited use rights expressly granted in these Terms.
				</p>

				<h2>Disclaimers</h2>
				<p>
					THE GUISE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY
					WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
					LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
					PARTICULAR PURPOSE, OR NON-INFRINGEMENT. GUISE APP DOES NOT WARRANT
					THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT
					ANY DEFECTS WILL BE CORRECTED. YOU USE THE SERVICE AT YOUR OWN SOLE
					RISK.
				</p>
				<p>
					Guise App is not responsible for the content created, shared, or used
					by its users. Any themes, tools, or configurations developed by users
					are the sole responsibility of the user who created them.
				</p>

				<h2>Limitation of Liability</h2>
				<p>
					TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
					GUISE APP, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR LICENSORS BE
					LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
					OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF
					PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT
					OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
				</p>

				<h2>Changes to Terms</h2>
				<p>
					We reserve the right to modify these Terms at any time. If we make
					changes, we will notify you by revising the date at the top of the
					Terms and, in some cases, we may provide you with additional notice
					(such as adding a statement to our homepage or sending you a
					notification). Your continued use of the Service after the effective
					date of the revised Terms constitutes your acceptance of the changes.
				</p>

				<h2>Contact Us</h2>
				<p>
					If you have any questions about these Terms, please contact us at
					[...].
				</p>
			</Section>
		</Article>
	);
}
