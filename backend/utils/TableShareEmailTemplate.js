const TableShareEmailTemplate = (config) => {
    return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Access Invitation</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
        <tr>
            <td style="padding: 20px;">
                <!-- Main container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Top colored bar -->
                    <tr>
                        <td style="height: 4px; background-color: #1B5E20; font-size: 1px; line-height: 1px;">&nbsp;</td>
                    </tr>
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 25px; background-color: #1B5E20; color: #ffffff; text-align: center;">
                            <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: bold;">🎉 Table Access Granted</h1>
                            <p style="margin: 0; opacity: 0.9; font-size: 14px;">You've been invited to collaborate!</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            
                            <!-- Intro text -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; margin-bottom: 25px;">
                                        <p style="font-size: 18px; color: #333333; margin: 0 0 25px 0; font-weight: 500;">
                                            <strong>${config.userName}</strong> added you as a 
                                            <span style="display: inline-block; background-color: #1B5E20; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Collaborator</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Details section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 10px; border-left: 4px solid #1B5E20; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0; font-weight: 500;">Following are the table details:</p>
                                        
                                        <!-- Table Name Row -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px; background-color: #ffffff; border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 12px; vertical-align: middle;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="width: 35px; vertical-align: middle;">
                                                                <div style="width: 35px; height: 35px; background-color: #1B5E20; border-radius: 8px; display: inline-block; text-align: center; line-height: 35px; font-size: 16px;">📊</div>
                                                            </td>
                                                            <td style="padding-left: 12px; vertical-align: middle;">
                                                                <span style="font-weight: 600; color: #333333; font-size: 14px; display: inline-block; min-width: 100px;">Table Name:</span>
                                                            </td>
                                                            <td style="padding-left: 15px; vertical-align: middle; width: 100%; text-align: left;">
                                                                <span style="background-color: #f8f9fa; padding: 8px 14px; border-radius: 8px; border: 2px solid #e9ecef; color: #495057; font-size: 14px; font-weight: 500; display: inline-block; min-width: 200px;">${config.sheetName}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Access Type Row -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px; background-color: #ffffff; border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 12px; vertical-align: middle;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="width: 35px; vertical-align: middle;">
                                                                <div style="width: 35px; height: 35px; background-color: #1B5E20; border-radius: 8px; display: inline-block; text-align: center; line-height: 35px; font-size: 16px;">🔐</div>
                                                            </td>
                                                            <td style="padding-left: 12px; vertical-align: middle;">
                                                                <span style="font-weight: 600; color: #333333; font-size: 14px; display: inline-block; min-width: 100px;">Access Type:</span>
                                                            </td>
                                                            <td style="padding-left: 15px; vertical-align: middle; width: 100%; text-align: left;">
                                                                <span style="background-color: #fff3cd; padding: 8px 14px; border-radius: 8px; border: 2px solid #ffeaa7; color: #856404; font-size: 14px; font-weight: 600; display: inline-block; min-width: 200px;">${config.accessType === 'View' ? 'Viewer' : config.accessType === 'Edit' ? 'Editor' : config.accessType}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Owner Row -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 12px; vertical-align: middle;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="width: 35px; vertical-align: middle;">
                                                                <div style="width: 35px; height: 35px; background-color: #1B5E20; border-radius: 8px; display: inline-block; text-align: center; line-height: 35px; font-size: 16px;">👤</div>
                                                            </td>
                                                            <td style="padding-left: 12px; vertical-align: middle;">
                                                                <span style="font-weight: 600; color: #333333; font-size: 14px; display: inline-block; min-width: 100px;">Owner:</span>
                                                            </td>
                                                            <td style="padding-left: 15px; vertical-align: middle; width: 100%; text-align: left;">
                                                                <span style="background-color: #E8F5E8; padding: 8px 14px; border-radius: 8px; border: 2px solid #A5D6A7; color: #1B5E20; font-size: 14px; font-weight: 600; display: inline-block; min-width: 200px;">${config.userEmail}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Action button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${config.viewLink}" style="display: inline-block; background-color: #1B5E20; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">🚀 Access Table Now</a>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 25px; text-align: center; color: #666666; font-size: 13px; border-top: 1px solid #e9ecef;">
                            <p style="margin: 8px 0; line-height: 1.5;">If you have any questions, please contact the table owner directly.</p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

export default TableShareEmailTemplate;
